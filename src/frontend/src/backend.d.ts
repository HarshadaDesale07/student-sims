import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export type RegisterResult = {
    __kind__: "ok";
    ok: Student;
} | {
    __kind__: "err";
    err: string;
};
export interface UpdateProfileInput {
    name: string;
    address: string;
    mobile: string;
}
export type SessionToken = string;
export interface RegisterInput {
    prn: string;
    name: string;
    email: string;
    address: string;
    mobile: string;
    hashedPassword: string;
}
export type DeleteResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type UpdateResult = {
    __kind__: "ok";
    ok: Student;
} | {
    __kind__: "err";
    err: string;
};
export type AdminLoginResult = {
    __kind__: "ok";
    ok: SessionToken;
} | {
    __kind__: "err";
    err: string;
};
export interface Student {
    prn: string;
    principal: UserId;
    name: string;
    createdAt: Timestamp;
    email: string;
    address: string;
    mobile: string;
}
export interface backendInterface {
    adminLogin(email: string, hashedPassword: string): Promise<AdminLoginResult>;
    adminUpdateStudent(token: SessionToken, prn: string, input: UpdateProfileInput): Promise<UpdateResult>;
    deleteStudent(token: SessionToken, prn: string): Promise<DeleteResult>;
    getAllStudents(token: SessionToken, offset: bigint, limit: bigint): Promise<Array<Student>>;
    getMyProfile(): Promise<Student | null>;
    registerStudent(input: RegisterInput): Promise<RegisterResult>;
    searchStudents(token: SessionToken, searchQuery: string): Promise<Array<Student>>;
    updateMyProfile(input: UpdateProfileInput): Promise<UpdateResult>;
}
