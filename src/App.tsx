import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { GlobalLoadingOverlay } from "@/components/ui/loading";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { MentorLayout } from "@/components/layout/MentorLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MentorLogin from "./pages/MentorLogin";
import MentorSignup from "./pages/MentorSignup";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import CourseView from "./pages/student/CourseView";
import LiveClasses from "./pages/student/LiveClasses";
import Assignments from "./pages/student/Assignments";
import AssignmentDetail from "./pages/student/AssignmentDetail";
import Certificates from "./pages/student/Certificates";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";
import Settings from "./pages/student/Settings";
import Payment from "./pages/student/Payment";

// Mentor Pages
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorCourses from "./pages/mentor/Courses";
import CourseManage from "./pages/mentor/CourseManage";
import CurriculumEditor from "./pages/mentor/CurriculumEditor";
import MentorSessions from "./pages/mentor/Sessions";
import MentorAssignments from "./pages/mentor/Assignments";
import MentorSubmissions from "./pages/mentor/Submissions";
import MentorStudents from "./pages/mentor/Students";
import MentorCertificates from "./pages/mentor/Certificates";
import MentorCommunication from "./pages/mentor/Communication";
import MentorReports from "./pages/mentor/Reports";
import MentorProfile from "./pages/mentor/Profile";
import MentorSettings from "./pages/mentor/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminInvitations from "./pages/admin/Invitations";
import AdminCoupons from "./pages/admin/Coupons";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LoadingProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <GlobalLoadingOverlay />
            <BrowserRouter>
              <Routes>
                {/* Public Routes with Layout */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:slug" element={<CourseDetails />} />
                </Route>

                {/* Auth Routes (no layout) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/mentor/login" element={<MentorLogin />} />
                <Route path="/mentor/signup" element={<MentorSignup />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Student Portal Routes */}
                <Route path="/student" element={<StudentLayout />}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="courses" element={<StudentCourses />} />
                  <Route path="courses/:courseId" element={<CourseView />} />
                  <Route path="classes" element={<LiveClasses />} />
                  <Route path="assignments" element={<Assignments />} />
                  <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
                  <Route path="certificates" element={<Certificates />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="payment/:courseId" element={<Payment />} />
                </Route>

                {/* Mentor Portal Routes */}
                <Route path="/mentor" element={<MentorLayout />}>
                  <Route path="dashboard" element={<MentorDashboard />} />
                  <Route path="courses" element={<MentorCourses />} />
                  <Route path="courses/:courseId" element={<CourseManage />} />
                  <Route path="courses/:courseId/curriculum" element={<CurriculumEditor />} />
                  <Route path="sessions" element={<MentorSessions />} />
                  <Route path="assignments" element={<MentorAssignments />} />
                  <Route path="submissions" element={<MentorSubmissions />} />
                  <Route path="students" element={<MentorStudents />} />
                  <Route path="certificates" element={<MentorCertificates />} />
                  <Route path="communication" element={<MentorCommunication />} />
                  <Route path="reports" element={<MentorReports />} />
                  <Route path="profile" element={<MentorProfile />} />
                  <Route path="settings" element={<MentorSettings />} />
                </Route>

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="invitations" element={<AdminInvitations />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </LoadingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
