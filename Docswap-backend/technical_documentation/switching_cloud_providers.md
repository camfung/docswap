# A Guide to Switching Cloud Providers

## Authentication
The current authentication system uses Azure AD B2C to validate "Authentication" header value.
The authentication middleware requires a function to return a jwt token if it has been validated. This function is called
via the `AuthHandlerInterface`. Implement this interface with your new logic.
To do this, the follow changes are required:

1. Create a new `struct` that implements the `utils/auth/auth_handler_interface.go` interface:
    ```go
    type AuthHandler struct{}

    func NewAuthHandler() *AuthHandler {}

    func (ah *AuthHandler) ParseAndValidateToken(tokenStr string) (*jwt.Token, error) {
        // Parsing and validation logic here
    }
   ```
   
2. Update the `utils/dependency_injection/auth_di.go` file to use the newly implemented AuthHandler:
    ```go
    func InitAuthDependencies() auth.AuthHandlerInterface {
        var authHandler auth.AuthHandlerInterface = auth.NewAuthHandler() // Change this value to whatever your struct is
        return authHandler
    }
   ```

3. Ensure ExternalUserID is populated when creating users.
   - The `models/user.go` model contains an `ExternalUserID` field, which should be populated with a unique identifier
from the new cloud authentication service. This is used to make a reference between the user in the cloud service 
and the user in the Docswap database.
   - NOTE: In Azure, this field is populated using the users Object ID (`oid`) provided on the JWT token
     - You can find this ID in the Azure portal under `B2C > Users > (*select user) > Object ID`

   
## Database
The current database used for this project is an Azure cloud SQL Server database. All the logic in the project to connect 
to and query the database, is generic and will work for any SQL database. Please note that the current implementation of the
system requires a SQL database; a non-relational database will not work. To change the database, you must 
update the connection string in the `.env` file. (More details on environment variables are provided in the `README.md`):
```
DB_CONNECTION_STRING="{db_connection_string}"
```

## File storage
The system currently uses Azure blob storage to store uploaded files. All logic related to this is dependent on interfaces,
meaning that, in order to change the file storage system, you must re-implement these interface with your desired logic.
To achieve this you must:
1. Create a new `struct` that implements the `daos/interfaces/file_storage_dao_interface.go` interface:
    ```go
    type CloudStorageDao struct{}

    func NewCloudStorageDao() *CloudStorageDao {}

    func (dao *CloudStorageDao) UploadFileDao(key string, file io.Reader) (string, error) {
        // Your file storage connection and upload logic here
    }

    func (dao *CloudStorageDao) GetFileDao(key string) (io.Reader, error) {
        // Your file storage connection and download logic here
    }
   ```

2. Create a new `struct` that implements the `services/interfaces/file_storage_service_interface.go` interface:
    ```go
    type CloudStorageService struct{}

    func NewCloudStorageService() *CloudStorageService {}

    func (dao *CloudStorageService) CreateFile(document *models.Document, file io.Reader) (string, error) {
        // Business logic and data pre/post processing for file upload
    }

    func (dao *CloudStorageService) GetFile(document *models.Document) (io.Reader, error) {
        // Business logic and data pre/post processing for file download
    }
   ```

3. Update the `utils/dependency_injection/document_di.go` file to use the newly implemented structures:
    ```go
    func InitDocumentDependencies() *controllers.DocumentController {
        var storageDao daoInterfaces.FileStorageDaoInterface = daos.NewCloudStorageDao()
        var storageService servInterfaces.FileStorageServiceInterface = services.NewCloudStorageService(storageDao)
   
        ...
    }
    ```
   
## NOTE: Front end authentication
- The current front end Docswap application is using the Azure authentication provider to register, login and generate
tokens
- In order for the front end to be configured for a new cloud authentication provider, it must be updated to generate
valid tokens for the new provider