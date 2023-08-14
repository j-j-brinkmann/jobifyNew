import React from "react";
import { Form, redirect, useNavigation, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import Logo from "../components/Logo";
import FormRow from "../components/FormRow";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

// Hier bekommen wir die NUTZERDATEN AUS DEM REGISTRIERFORMULAR zurück
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    // SCHICKE DIE NUTZERDATEN ANS BACKEND
    await customFetch.post("/auth/register", data);
    // INFO: redirect sollte nur in actions verwendet werden
    toast.success("registration success :)");
    return redirect("/login");
    return null;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    // console.log(error);
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <FormRow type="text" name="name" placeholder="name" />
        <FormRow
          type="text"
          name="lastName"
          labelText="last name"
          placeholder="last name"
        />
        <FormRow type="email" name="email" placeholder="email" />
        <FormRow type="password" name="password" placeholder="password" />
        <FormRow type="text" name="location" placeholder="location" />
        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "submitting..." : "register"}
        </button>
        <p>Already registered?</p>
        <Link to="/login" className="member-btn">
          Login
        </Link>
      </Form>
    </Wrapper>
  );
};

export default Register;
