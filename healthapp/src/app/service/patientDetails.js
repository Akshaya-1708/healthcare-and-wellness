import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import patientData from "../../components/pages/DashboardScreen/mockJson/patientDetails.json";

// Utility function to simulate delay
const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getPatientProfile: builder.query({
      queryFn: async () => {
        try {
          await simulateDelay(100); // simulate network delay
          if (!patientData) {
            throw new Error("Patient data not found");
          }
          return { data: patientData };
        } catch (err) {
          return { error: { status: "CUSTOM_ERROR", message: err.message } };
        }
      },
    }),

    getInsurance: builder.query({
      queryFn: async () => {
        try {
          await simulateDelay(300);
          if (!patientData.insurance) {
            throw new Error("Insurance data missing");
          }
          return { data: patientData.insurance };
        } catch (err) {
          return { error: { status: "CUSTOM_ERROR", message: err.message } };
        }
      },
    }),

    getAppointmentsByYear: builder.query({
      queryFn: async (year) => {
        try {
          await simulateDelay(400);
          const appointments = patientData.years?.[year]?.appointments;
          if (!appointments) {
            throw new Error(`No appointments found for year ${year}`);
          }
          return { data: appointments };
        } catch (err) {
          return { error: { status: "CUSTOM_ERROR", message: err.message } };
        }
      },
    }),
  }),
});

export const {
  useGetPatientProfileQuery,
  useGetInsuranceQuery,
  useGetAppointmentsByYearQuery,
} = patientApi;
