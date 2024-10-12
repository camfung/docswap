'use client';

import { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Document } from '@/types';
import axios from 'axios';


interface DocumentContextType {
  documents: Document[];
  currentUserDocuments: Document[];
  fetchDocuments: (full?: boolean) => Promise<void>;
  fetchCurrentUserDocuments: (includeDeleted?: boolean, full?: boolean) => Promise<void>;
  searchDocuments: (searchObj: object, full: boolean) => Promise<Document[]>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentUserDocuments, setCurrentUserDocuments] = useState<Document[]>([]);

  const fetchDocuments = useCallback(async (full: boolean = false) => {
    try {
      // Fetch data
      const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/document/`;
      const response = await axios.get(url, {
        params: {
          full: full
        }
      })
      const documents = response.data;
      setDocuments(documents);
    } catch (error) {
      // Handle error
      console.error('Error fetching documents:', error);
    }
  }, []);

  const searchDocuments = useCallback(async (searchObj: object, full: boolean): Promise<Document[]> => {
    try {
      // Fetch data
      const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/document/search`;
      const response = await axios.post(url, searchObj, {
        params: {
          full: full
        }
      })
      const documents = response.data;
      return documents;
    } catch (error) {
      // Handle error
      console.error('Error searching documents:', error);
      return [];
    }
  }, []);

  const fetchCurrentUserDocuments = useCallback(async (includeDeleted: boolean = false, full: boolean = false) => {
    try {
      // Fetch current user data
      const currentUserResponse = await axios.get(`${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/user/current`);
      const currentUser = currentUserResponse.data;
      const currentUserId = currentUser.ID;

      const searchObject = {
        Params: [
          {
            Field: "user_documents.user_id",
            Operator: "=",
            Value: currentUserId,
            AssociationForeignKey: "document_id"
          },
          {
            Field: "user_documents.is_owner",
            Operator: "=",
            Value: true,
            AssociationForeignKey: "document_id"
          }
        ],
        LogicalOperator: "AND"
      };

      if (!includeDeleted) {
        searchObject.Params.push({
          Field: "documents.deleted_at",
          Operator: "IS NULL",
          Value: null,
          AssociationForeignKey: ""
        });
      }

      // Search documents for the current user
      const documentSearchResults = await searchDocuments(searchObject, full);
      console.log('documentSearchResults:', documentSearchResults);
      setCurrentUserDocuments(documentSearchResults);
    } catch (error) {
      // Handle error
      console.error('Error fetching current user documents:', error);
    }
  }, [searchDocuments]);

  
  return (
    <DocumentContext.Provider value={{ documents, currentUserDocuments, fetchDocuments, fetchCurrentUserDocuments, searchDocuments }}>
      {children}
    </DocumentContext.Provider>
  );
};