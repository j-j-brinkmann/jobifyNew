import React from "react";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import {
  Link,
  Form,
  redirect,
  useNavigation,
  useNavigate,
} from "react-router-dom";
import { FormRow, Logo } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post("/auth/login", data);
    toast.success("welcome back");
    return redirect("/dashboard");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const loginDemoUser = async () => {
    const data = {
      email: "demo@test.com",
      password: "demopass",
    };
    try {
      await customFetch.post("/auth/login", data);
      toast.success("Restricted Access with Demo Account");
      navigate("/dashboard");
    } catch (error) {}
  };
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <FormRow type="email" name="email" placeholder="email" />
        <FormRow type="password" name="password" placeholder="password" />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "logging in..." : "submit"}
        </button>
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          Login with Demo Account
        </button>
        <p>Not registered?</p>
        <Link to="/register" className="member-btn">
          Register
        </Link>
      </Form>
    </Wrapper>
  );
};

export default Login;
