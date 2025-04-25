import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Load from .env
const BOOK_API_URL = `${BASE_URL}/api/v1/books`;

export interface Book {
    id?: number;
    title: string;
    bookCoverImage: string;
    originalPrice: number;
    discount?: number;
    qty?: number;
    publishDate: string;
    authorName: string;
    category: string;
    description: string;
    rating?: number; // ✅ Added rating
    createdByEmail?: string; // ✅ Added rating
}

class BookService {
    // Fetch all books
    getBooks() {
        return axios
            .get<Book[]>(BOOK_API_URL)
            .then((response) => response.data)
            .catch((error) => {
                console.error("Error fetching books:", error);
                throw error;
            });
    }

    // Fetch books based on slug (top-books, category, new-arrivals, today's deal)
    getBooksBySlug(slug: string, category?: string) {
        let url = `${BOOK_API_URL}/${slug}`;
        if (slug === "category" && category) {
            url += `?category=${encodeURIComponent(category)}`;
        }
        return axios
            .get<Book[]>(url)
            .then((response) => response.data)
            .catch((error) => {
                console.error(`Error fetching books for slug ${slug}:`, error);
                throw error;
            });
    }

    addBook(book: Book) {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
            console.error("No token found");
            throw new Error("Authorization token not found.");
        }
    
        return axios
            .post<Book>(`${BASE_URL}/api/v1/add-books`, book, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.data)
            .catch((error) => {
                console.error("Error adding new book:", error.response?.data || error.message);
                throw error;
            });
    }
    
    // Fetch books created by a specific user via email
getBooksByCreatorEmail(email: string) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found");
        throw new Error("Authorization token not found.");
    }

    return axios
        .get<Book[]>(`${BASE_URL}/api/v1/created-by`, {
            params: { email },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching books by creator email:", error.response?.data || error.message);
            throw error;
        });
}

}

export default new BookService();
