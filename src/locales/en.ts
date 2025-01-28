export const translations = {
  nav: {
    home: 'Home',
    programs: 'Programs',
    about: 'About',
    research: 'Research',
    contact: 'Contact',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    search: 'Search',
    hello: 'Hello',
  },
  common: {
    loading: 'Loading...',
    close: 'Close',
    error: 'Error',
    success: 'Success',
    or: 'or',
    back: 'Go back',
    submit: 'Submit',
  },
  login: {
    title: 'Welcome Back',
    form: {
      email: 'Email Address',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot Password?',
      submit: 'Sign In',
      facebookLogin: 'Sign in with Facebook',
      noAccount: 'Don\'t have an account?',
      createAccount: 'Create Account',
    },
    errors: {
      invalidEmail: 'Invalid email format',
      invalidPassword: 'Password must be at least 8 characters long',
      loginFailed: 'Invalid email or password',
      tooManyAttempts: 'Too many login attempts. Please try again later.',
      required: 'This field is required',
    },
  },
  resetPassword: {
    title: 'Reset Password',
    subtitle: 'Enter your email address and we will send you a password reset link.',
    form: {
      email: 'Email Address',
      emailPlaceholder: 'Enter your email',
      submit: 'Reset Password',
      backToLogin: 'Back to Login',
    },
    success: {
      title: 'Check your email',
      message: 'If the email address exists in our system, you will receive a password reset link shortly.',
    },
    errors: {
      invalidEmail: 'Invalid email format',
      required: 'This field is required',
      tooManyAttempts: 'Too many attempts. Please try again later.',
      resetFailed: 'Failed to reset password. Please try again.',
    },
  },
  programs: {
    plans: {
      title: 'Get ready – we\'re coming in 2025!',
      subtitle: 'Save your spot today and enjoy a lower price at launch!',
    },
    content: {
      title: 'Our Learning Content',
      subtitle: 'Discover what makes our content unique and valuable',
    },
    categories: {
      plans: 'Plans',
      content: 'Content',
    },
  },
  signUp: {
    title: 'Sign Up',
    individual: 'Individual',
    organization: 'Organization',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone Number',
    password: 'Password',
    organizationName: 'Organization Name',
    gdprConsent: 'I agree to the Privacy Policy and Terms',
    next: 'Next',
    prev: 'Back',
    back: 'Back',
    submit: 'Sign Up',
    loading: 'Signing up...',
    errors: {
      required: 'This field is required',
      invalidEmail: 'Invalid email format',
      invalidPhone: 'Invalid phone number',
      invalidPassword: 'Password must be at least 8 characters long, include uppercase letter, number and special character',
      invalidName: 'Name must be at least 2 characters long and cannot contain special characters',
      gdprRequired: 'You must agree to the Privacy Policy',
      unexpectedError: 'An unexpected error occurred',
      validationFailed: 'Please check your input',
      passwordMinLength: 'Password must be at least {length} characters long',
      passwordUppercase: 'Password must contain at least one uppercase letter',
      passwordNumber: 'Password must contain at least one number',
      passwordSpecial: 'Password must contain at least one special character',
      phoneInvalid: 'Invalid phone number format',
      emailInvalid: 'Invalid email format',
      nameMinLength: 'Name must be at least 2 characters long',
      nameMaxLength: 'Name cannot be longer than 50 characters'
    },
    passwordStrength: {
      veryWeak: 'Very Weak',
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      veryStrong: 'Very Strong',
    },
    steps: {
      basicInfo: 'Basic Info',
      contacts: 'Contacts',
      confirmation: 'Confirmation'
    },
    gdpr: {
      consent: 'I agree to the processing of my personal data according to the {privacyPolicy}. I understand that I can withdraw my consent at any time and delete my account.',
      privacyPolicy: 'Privacy Policy',
      dataUsage: 'Your data will be used for:',
      purposes: {
        account: 'Account creation and management',
        services: 'Service provision',
        communication: 'Communication with you',
        legal: 'Legal obligations'
      }
    },
  },
  waitlist: {
    title: 'Join the Howkings University Waiting List!',
    subtitle: 'Sign up today and receive an exclusive offer - your first month completely free!',
    form: {
      email: 'Email address',
      submit: 'Join the waiting list',
      success: 'Thank you for registering!',
      error: {
        required: 'Email address is required',
        invalid: 'Invalid email format'
      }
    },
    stats: {
      students: 'Students already registered',
      security: 'Secure registration process',
      trial: 'Free trial period'
    }
  },
  requestPool: {
    errors: {
      fetchFailed: 'Failed to fetch requests. Please try again later.',
      loginRequired: 'Please sign in to vote',
      alreadyVoted: 'You have already voted for this module',
      moduleNotFound: 'Module not found',
      voteFailed: 'An error occurred while voting. Please try again.',
    },
    success: {
      voteRegistered: 'Your vote has been successfully registered!',
    },
    loading: 'Loading modules...',
    loginPrompt: 'You need to be signed in to vote.',
    loginButton: 'Sign In',
    searchPlaceholder: 'Search modules...',
    addRequestButton: 'Add Request',
    sort: {
      label: 'Sort by:',
      votes: 'Votes',
      date: 'Date',
      name: 'Name'
    }
  },
};
