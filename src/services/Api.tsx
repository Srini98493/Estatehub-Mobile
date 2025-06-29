// // Import necessary modules
// import axios, { AxiosResponse, AxiosError } from "axios";
// import { AppEnvironment } from "../../constants/Global";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Define interfaces for HTTP headers and methods
// interface HttpHeaders {
//     Accept?: any;
//     "Content-Type": any;
//     Authorization?: string;
// }

// interface FileHeaders {
//     "Content-Type": any;
// }

// interface MethodType {
//     "get": string,
//     "post": string
// }

// // Define a type for HTTP methods
// type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

// // Create a class for HTTP service
// class HttpService {
//     // Initialize the base URL for API requests
//     private apiBaseURL: any = AppEnvironment.ApiUrl;

//     // Define default headers for JSON requests
//     private headers: HttpHeaders = {
//         "Content-Type": "application/json",
//     };

//     // Define headers for file uploads
//     private fileHeaders: FileHeaders = {
//         "Content-Type": "multipart/form-data",
//     };

//     // GET Method
//     async get<T>(url: any, queryParams?: any, customHeaders?: HttpHeaders): Promise<T> {

//         const accessToken = await AsyncStorage.getItem("token");
//         const headers: HttpHeaders = { ...this.headers, ...(customHeaders || {}) };
//         if(accessToken){
//             headers.Authorization = `Bearer ${accessToken}`;
//         }

//         try {
//             const response: AxiosResponse<T> = await this.makeRequest('get', url, { headers, params: queryParams });
//             return response.data;
//         } catch (error: any) {
//             throw this.handleAxiosError(error);
//         }
//     }

//     // POST Method
//     async post<T>(url: any, data: any, queryParams?: any, customHeaders?: HttpHeaders, mediaType?: any): Promise<T> {
        
//         const accessToken = await AsyncStorage.getItem("token");
//         const headers: HttpHeaders = { ...this.headers, ...(customHeaders || {}) };
//         if(accessToken){
//             headers.Authorization = `Bearer ${accessToken}`;
//         }

//         const responseType = mediaType ? { responseType: 'blob' } : undefined;
//         try {
//             const response: AxiosResponse<T> = await this.makeRequest('post', url, data, { headers, ...responseType });
//             return response.data;
//         } catch (error: any) {
//             throw this.handleAxiosError(error);
//         }
//     }

//     // POST Method for file uploads
//     async postFile<T>(url: any, data: any, queryParams?: any, customHeaders?: HttpHeaders): Promise<T> {
        
//         const accessToken = await AsyncStorage.getItem("token");
//         const headers: HttpHeaders = { ...this.headers,...this.fileHeaders, ...(customHeaders || {}) };
//         if(accessToken){
//             headers.Authorization = `Bearer ${accessToken}`;
//         }
        
//         try {
//             const response: AxiosResponse<T> = await this.makeRequest('post', url, data, { headers });
//             return response.data;
//         } catch (error: any) {
//             throw this.handleAxiosError(error);
//         }
//     }

//     // Generic request method
//     private async makeRequest<T>(method: Methods, url: any, data: any, config: any = {}): Promise<AxiosResponse<T>> {
//         try {
            
//             const response: AxiosResponse<T> = await axios[method](this.apiBaseURL + url, data, config);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     // Handle Axios errors
//     private async handleAxiosError(error: AxiosError): Promise<any> {
//         if (error.response) {


//             const UserDetails = await AsyncStorage.getItem("userDetails");
//             const loginUserId = JSON.parse(UserDetails)?.userId;

//             if(loginUserId !== 0 && (error.response.status >= 400 && error.response.status < 500)){
            
//             if (error.response.status >= 400 && error.response.status < 500) {
//                 throw error.response.data;
//             } else {
//                 const message = {
//                     title: "Server Error",
//                     content: "Please try again later",
//                 };
//                 error.response.data = { message };
//                 throw error.response.data;
//             }
//         }
//         } else {
//             throw error;
//         }
//     }
// }

// // Create an instance of the HTTP service and export it
// export const httpService = new HttpService();
