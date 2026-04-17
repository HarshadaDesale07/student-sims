import type { backendInterface } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const mockPrincipal = { toText: () => "aaaaa-aa", _isPrincipal: true } as unknown as Principal;

const sampleStudents = [
  {
    prn: "PRN001",
    principal: mockPrincipal,
    name: "Aarav Sharma",
    createdAt: BigInt(1700000000000000000),
    email: "aarav.sharma@example.com",
    address: "12, MG Road, Pune, Maharashtra",
    mobile: "9876543210",
  },
  {
    prn: "PRN002",
    principal: mockPrincipal,
    name: "Priya Patel",
    createdAt: BigInt(1700000100000000000),
    email: "priya.patel@example.com",
    address: "45, Laxmi Nagar, Mumbai, Maharashtra",
    mobile: "9876543211",
  },
  {
    prn: "PRN003",
    principal: mockPrincipal,
    name: "Rohan Mehta",
    createdAt: BigInt(1700000200000000000),
    email: "rohan.mehta@example.com",
    address: "78, Koregaon Park, Pune, Maharashtra",
    mobile: "9876543212",
  },
];

export const mockBackend: backendInterface = {
  adminLogin: async (_email: string, _hashedPassword: string) => ({
    __kind__: "ok" as const,
    ok: "mock-session-token-abc123",
  }),

  adminUpdateStudent: async (_token, _prn, input) => ({
    __kind__: "ok" as const,
    ok: {
      prn: _prn,
      principal: mockPrincipal,
      name: input.name,
      createdAt: BigInt(1700000000000000000),
      email: "student@example.com",
      address: input.address,
      mobile: input.mobile,
    },
  }),

  deleteStudent: async (_token, _prn) => ({
    __kind__: "ok" as const,
    ok: null,
  }),

  getAllStudents: async (_token, _offset, _limit) => sampleStudents,

  getMyProfile: async () => ({
    prn: "PRN001",
    principal: mockPrincipal,
    name: "Aarav Sharma",
    createdAt: BigInt(1700000000000000000),
    email: "aarav.sharma@example.com",
    address: "12, MG Road, Pune, Maharashtra",
    mobile: "9876543210",
  }),

  registerStudent: async (input) => ({
    __kind__: "ok" as const,
    ok: {
      prn: input.prn,
      principal: mockPrincipal,
      name: input.name,
      createdAt: BigInt(1700000000000000000),
      email: input.email,
      address: input.address,
      mobile: input.mobile,
    },
  }),

  searchStudents: async (_token, searchQuery) =>
    sampleStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.prn.toLowerCase().includes(searchQuery.toLowerCase())
    ),

  updateMyProfile: async (_input) => ({
    __kind__: "ok" as const,
    ok: {
      prn: "PRN001",
      principal: mockPrincipal,
      name: _input.name,
      createdAt: BigInt(1700000000000000000),
      email: "aarav.sharma@example.com",
      address: _input.address,
      mobile: _input.mobile,
    },
  }),
};
