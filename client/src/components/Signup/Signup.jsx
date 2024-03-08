import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import "./Signup.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    name: Yup.string(), // Optional field
  });

  useEffect(() => {
    const storedResendData = localStorage.getItem("resendData");
    if (storedResendData) {
      const { count, timestamp } = JSON.parse(storedResendData);
      const currentTime = new Date().getTime();

      const elapsedTime = currentTime - timestamp;

      if (count < 3 && elapsedTime > 30000) {
        setResendDisabled(false);
      }
      else if(count >= 3 && elapsedTime > 3.6e+6) {
        localStorage.removeItem("resendData");
        setResendDisabled(false);
      }
    } else {
      setResendDisabled(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if(resendTimer > 0) {
        setResendTimer(prev => prev-1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [resendTimer]);

  const sendDataToServer = async (v) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          email: v.email,
          password: v.password
        };
        const res = await axios.post("http://localhost:5000/api/auth/signup", data);
        resolve(res.data);
        localStorage.setItem('authToken', res.data.token);
      } catch (error) {
        toast.error(error.response.data.error);
        reject(error);
      }
    });
  };

  const handleSubmit = async (values) => {

    try {
      setLoading(true);
      const res = await sendDataToServer(values);

      if(res.message === "User registered successfully") {
        if (resendDisabled) {
          toast.error("You have reached the maximum resend attempts. Please try again after some time.");
        } else {
          toast.success(`Welcome email would be sent to: ${values.email}`);

          const storedResendData = localStorage.getItem("resendData");
          const { count = 0 } = storedResendData ? JSON.parse(storedResendData) : {};
          if (count + 1 > 3) {
            setResendDisabled(true);
          }

          const resendData = {
            count: count + 1,
            timestamp: new Date().getTime(),
          };
          localStorage.setItem("resendData", JSON.stringify(resendData));
          setTimeout(() => {
            navigate('/posts');
        }, 1000);
        }

      } else {
        toast.error(res.error);
      }

    } catch(err) {
      console.error("An error occurred during sign up. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return(
    <section class="bg-gray-50 dark:bg-gray-900">
        <Toaster
          position="bottom-center"
        />
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                Advisoropedia
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign up
                    </h1>
                    <Formik
                        initialValues={{ email: '', password: '', confirmPassword: '', name: '', profilePicture: null }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => {
                          if (!checked) {
                            toast.error('Please agree to the Terms and Conditions');
                            return;
                        }
                            handleSubmit(values);
                        }}
                    >
                        {({ errors, touched, setFieldValue }) => (
                            <Form class="space-y-4 md:space-y-6" >
                                <div>
                                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <Field type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                                    <ErrorMessage name="email" component="div" className="error-message" />
                                </div>
                                <div>
                                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <Field type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                    <ErrorMessage name="password" component="div" className="error-message" />
                                </div>
                                <div>
                                    <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                    <Field type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                    <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                                </div>
                                <div>
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name (optional)</label>
                                    <Field type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" />
                                    <ErrorMessage name="name" component="div" className="error-message" />
                                </div>
                                <div>
                                    <label for="profilePicture" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture (optional)</label>
                                    <Field type="file" name="profilePicture" id="profilePicture" accept="image/*" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>

                                <div class="flex items-center justify-between">
                                    <div class="flex items-start">
                                        <div class="flex items-center h-5">
                                        <input id="remember" checked={checked} onChange={() => setChecked(!checked)} type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                        </div>
                                        <div class="ml-3 text-sm">
                                        <label for="remember" class="text-gray-500 dark:text-gray-300">By continuing, you agree to the terms and conditions of Advisoropedia.</label>
                                        </div>
                                    </div>
                                    {/* <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a> */}
                                </div>

                                <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? "loading...": "Sign up"}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Login;
