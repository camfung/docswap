import axios from "axios";
import { ReviewFormValues } from "./document-upload-form";
import { User, useUser } from "@/contexts/UserContext";

export function mapToFormData(data: ReviewFormValues) {
  const formData = new FormData();

  // Map title, description, and role
  formData.append('description', data.description || '');
  formData.append('role', data.role || '');

  // Map category and subCategory
  if (data.category) {
    formData.append('category_id', data.category.value);
  }

  if (data.subCategory) {
    formData.append('subcategory_id', data.subCategory.value);
  }
  return formData;
}
export type Category = {
  Name: any;
  ID: any;
  value: string;
  label: string;
};

export type Tag = {
  Name: any;
  ID: any;
  value: string;
  label: string;
};
export const fetchParentCategories = async (setError: any) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/category/search`;
    const response = await axios.post(url, {
      Params: [
        {
          Field: "parent_id",
          Operator: "IS NULL"
        }
      ]
    }, {
      params: {
        full: "false"
      }
    });


    if (response.status !== 200) {
      throw new Error('Failed to fetch categories');
    }
    const categories = response.data.map((category: Category, index: number) => ({
      value: category.ID,
      label: category.Name,
    }));
    console.log("🚀 ~ categories ~ response.data:", response.data)

    console.log("🚀 ~ fetchData ~ categories:", categories)
    return categories;
  } catch (error: any) {
    setError(error);
  }
};

export const fetchTags = async (user: User, setError: any, setLoading: any) => {
  console.log("🚀 ~ fetchTags ~ user:", user)
  try {
    const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/tag/search`;
    const response = await axios.post(url,
      {
        "Params": [
          {
            "Field": "user_tags.user_id",
            "Operator": "=",
            "Value": user?.id,
            "AssociationForeignKey": "tag_id"
          }
        ]
      }
    );


    if (response.status !== 200) {
      throw new Error('Failed to fetch categories');
    }
    const tags = response.data.map((tag: Tag, index: number) => ({
      value: tag.ID,
      label: tag.Name,
    }));
    console.log("🚀 ~ tags ~ tags:", tags)
    return tags;
  } catch (error: any) {
    setError(error);
  } finally {
    setLoading(false);
  }
};