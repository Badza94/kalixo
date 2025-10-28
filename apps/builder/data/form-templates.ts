import { FormTemplate } from "../types/form";

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "newsletter",
    name: "Newsletter Signup",
    description: "Simple email collection for newsletters",
    fields: [
      {
        id: "email",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
      },
      {
        id: "name",
        type: "text",
        label: "First Name",
        placeholder: "Enter your first name",
        required: false,
      },
    ],
    submitAction: {
      type: "newsletter",
      successMessage: "Thanks for subscribing to our newsletter!",
    },
  },
  {
    id: "contact",
    name: "Contact Form",
    description: "Complete contact form with multiple fields",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "Enter your email",
        required: true,
      },
      {
        id: "phone",
        type: "tel",
        label: "Phone Number",
        placeholder: "Enter your phone number",
        required: false,
      },
      {
        id: "subject",
        type: "text",
        label: "Subject",
        placeholder: "What is this about?",
        required: true,
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Enter your message",
        required: true,
        validation: {
          minLength: 10,
          maxLength: 1000,
        },
      },
    ],
    submitAction: {
      type: "contact",
      successMessage: "Message sent successfully! We'll get back to you soon.",
    },
  },
  {
    id: "survey",
    name: "Customer Survey",
    description: "Multi-question survey form",
    fields: [
      {
        id: "satisfaction",
        type: "radio",
        label: "How satisfied are you with our service?",
        options: [
          "Very Satisfied",
          "Satisfied",
          "Neutral",
          "Dissatisfied",
          "Very Dissatisfied",
        ],
        required: true,
      },
      {
        id: "recommend",
        type: "select",
        label: "Would you recommend us to others?",
        options: [
          "Definitely",
          "Probably",
          "Maybe",
          "Probably Not",
          "Definitely Not",
        ],
        required: true,
      },
      {
        id: "experience",
        type: "select",
        label: "How would you rate your overall experience?",
        options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
        required: true,
      },
      {
        id: "feedback",
        type: "textarea",
        label: "Additional Comments",
        placeholder: "Share any additional feedback...",
        required: false,
      },
    ],
    submitAction: {
      type: "survey",
      successMessage:
        "Thank you for your feedback! Your input helps us improve.",
    },
  },
  {
    id: "registration",
    name: "Event Registration",
    description: "Registration form for events or workshops",
    fields: [
      {
        id: "firstName",
        type: "text",
        label: "First Name",
        required: true,
      },
      {
        id: "lastName",
        type: "text",
        label: "Last Name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
      },
      {
        id: "phone",
        type: "tel",
        label: "Phone Number",
        required: true,
      },
      {
        id: "company",
        type: "text",
        label: "Company/Organization",
        required: false,
      },
      {
        id: "dietary",
        type: "textarea",
        label: "Dietary Restrictions",
        placeholder: "Please let us know about any dietary restrictions...",
        required: false,
      },
    ],
    submitAction: {
      type: "contact",
      successMessage:
        "Registration successful! You'll receive a confirmation email shortly.",
    },
  },
  {
    id: "feedback",
    name: "Quick Feedback",
    description: "Simple feedback collection form",
    fields: [
      {
        id: "rating",
        type: "radio",
        label: "Rate your experience",
        options: [
          "1 - Poor",
          "2 - Fair",
          "3 - Good",
          "4 - Very Good",
          "5 - Excellent",
        ],
        required: true,
      },
      {
        id: "category",
        type: "select",
        label: "What best describes your feedback?",
        options: [
          "Bug Report",
          "Feature Request",
          "General Feedback",
          "Compliment",
          "Complaint",
        ],
        required: true,
      },
      {
        id: "message",
        type: "textarea",
        label: "Your Feedback",
        placeholder: "Tell us more...",
        required: true,
      },
    ],
    submitAction: {
      type: "survey",
      successMessage: "Thank you for your feedback! We appreciate your input.",
    },
  },
];

export const DEFAULT_FORM_STYLING = {
  layout: "vertical" as const,
  spacing: "normal" as const,
  buttonStyle: "primary" as const,
  buttonText: "Submit",
  buttonSize: "default" as const,
  fieldSpacing: "md" as const,
};
