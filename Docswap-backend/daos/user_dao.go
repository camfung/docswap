package daos

import (
	"github.com/DOC-SWAP/Docswap-backend/models"
	"github.com/DOC-SWAP/Docswap-backend/utils/database"
	"time"
)

type UserDao struct{}

func NewUserDao() *UserDao {
	return &UserDao{}
}

func (dao *UserDao) GetAllUsersDao(includeDeleted bool, full bool) ([]models.User, error) {
	db := database.GetInstance()

	var users []models.User
	query := db.Model(&models.User{})

	if full {
		query.Preload("Documents.Document").Preload("Roles.Role").Preload("Configs.Config")
	}
	if !includeDeleted {
		query.Where("deleted_at IS NULL")
	}

	if err := query.Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (dao *UserDao) GetUserDao(id int, includeDeleted bool, full bool) (*models.User, error) {
	db := database.GetInstance()

	var user models.User
	query := db.Model(&models.User{})

	if full {
		query.Preload("Documents.Document").Preload("Roles.Role").Preload("Configs.Config")
	}
	if !includeDeleted {
		query.Where("deleted_at IS NULL")
	}

	if err := query.First(&user, id).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (dao *UserDao) GetUserByExternalIdDao(externalId string, includeDeleted bool, full bool) (*models.User, error) {
	db := database.GetInstance()

	var user models.User
	query := db.Model(&models.User{})

	if full {
		query.Preload("Documents.Document").Preload("Roles.Role").Preload("Configs.Config")
	}
	if !includeDeleted {
		query.Where("deleted_at IS NULL")
	}

	if err := query.Where("external_user_id = ?", externalId).First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (dao *UserDao) CreateUserDao(user *models.User) (*models.User, error) {
	db := database.GetInstance()

	if err := db.Create(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (dao *UserDao) UpdateUserDao(updatedUser *models.User) (*models.User, error) {
	db := database.GetInstance()

	var existingUser models.User
	if err := db.Where("id = ?", updatedUser.ID).First(&existingUser).Error; err != nil {
		return nil, err
	}

	if err := db.Model(&existingUser).Omit("ID", "ExternalUserID").Updates(updatedUser).Error; err != nil {
		return nil, err
	}

	return &existingUser, nil
}

func (dao *UserDao) UpdateUserByExternalID(externalID string, updatedData *models.User) (*models.User, error) {
	db := database.GetInstance()
	var user models.User
	if err := db.Where("external_user_id = ?", externalID).First(&user).Error; err != nil {
		return nil, err
	}

	if err := db.Model(&user).Updates(updatedData).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (dao *UserDao) DeleteUserDao(id int) error {
	db := database.GetInstance()

	if err := db.Delete(&models.User{}, id).Error; err != nil {
		return err
	}

	return nil
}

func (dao *UserDao) SoftDeleteUserDao(id int) error {
	db := database.GetInstance()

	if err := db.Model(&models.User{}).Where("id = ?", id).Update("deleted_at", time.Now()).Error; err != nil {
		return err
	}

	return nil
}
