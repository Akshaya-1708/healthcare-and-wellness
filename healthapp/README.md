HCL Healthcare

# **System Flow (Frontend Only — Healthcare Wellness & Preventive Care Portal)**

** 1. Authentication Flow**   - Role Base Access

1. User opens Login page --> verifyOTP --> Get Role and other details
2. Submits credentials → API returns **JWT + user role**
3. Token stored in **localStorage**
4. Redirect:

   * **Patient → /patient/dashboard**
   * **Provider → /provider/dashboard**
5. Protected routes validate token before rendering


---

## **2. Patient Flow**

**Profile Management**

* View/update basic health info 
* Allergies, medications, personal info, consultations,lab reports,wellness


1. Personal Information

Full Name

Email (usually non-editable)

Phone Number

Date of Birth

Gender

Address

Profile Photo


2. Basic Health Information

Blood Group

Height & Weight (BMI auto-calculated)

Allergies

Current Medications

Chronic Conditions (e.g., diabetes, asthma)

Past Surgeries / Medical History

Vaccination History 

Smoking/Drinking habits (optional, if privacy-sensitive)

Last preventive checkup date

Next due preventive screening

**3. Wellness & Lifestyle Info**
Daily step goal

Sleep goal

Water intake goal

Dietary preferences (veg/non-veg)

Activity level (sedentary/moderate/active)

**4. Emergency Contact**

Contact Name

Relationship

Phone Number

Secondary backup contact (optional)





**Patient Dashboard**

* Fetch daily wellness goals (steps, sleep, water intake)
* Fetch preventive care reminders
* Show “Health Tip of the Day”

**Goal Tracker**

* Log steps / water intake / activities
* Update daily goal progress

---

## ** 3. Healthcare Provider Flow**

**Provider Dashboard**

* Fetch list of assigned patients
* View compliance status (Goal Met / Missed Checkup)

**Patient Details**

* View individual patient goal logs
* View preventive care history
* Monitor compliance trends

## **🌐 4. Public Module Flow**

* Public Health Information page (static content)
* Privacy Policy page

No authentication required.

---

## **5. Routing Flow**

* **Public Routes:** `/login`, `/register`, `/health-info`, `/privacy-policy`
* **Patient Routes:** `/patient/dashboard`, `/patient/profile`, `/patient/goals`
* **Provider Routes:** `/provider/dashboard`, `/provider/patient/:id`
* **ProtectedRoute** checks:

  * User logged in
  * User role matches page

---

## **6. Component Flow**

**Shared**

* Navbar
* Sidebar
* ProtectedRoute
* AuthContext

**UI Components**

* GoalProgress
* CardStat
* HealthTip

---

## **7. Data Flow (Frontend)**

1. Axios instance attaches token to every request
2. On success → update UI
3. On `401` → auto logout & redirect to login
4. React Query / RTK Query manages caching

---


