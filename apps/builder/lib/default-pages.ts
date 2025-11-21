import { Data } from "@measured/puck";

// List of pages that cannot be edited
export const READ_ONLY_PAGES = ["/login", "/register", "/checkout"];

// Check if a page is read-only
export function isReadOnlyPage(path: string): boolean {
  // Remove /edit suffix if present for checking
  const cleanPath = path.replace("/edit", "");
  return READ_ONLY_PAGES.includes(cleanPath);
}

// Default pages to initialize if they don't exist
export function getDefaultPages(): Record<string, Data> {
  return {
    "/login": {
      root: { props: { title: "Login" } },
      content: [
        {
          type: "ContainerBlock",
          props: {
            id: "login-container",
            width: "container",
            padding: {
              top: "48px",
              right: "24px",
              bottom: "48px",
              left: "24px",
            },
            backgroundColor: { colorKey: "background" },
            direction: "column",
            gap: { all: "32px" },
            items: [
              {
                content: [
                  {
                    type: "ImageBlock",
                    props: {
                      id: "login-logo",
                      src: "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
                      alt: "Logo",
                      width: 200,
                      height: 60,
                      aspectRatio: "auto",
                      fill: false,
                      objectFit: "contain",
                      objectPosition: "center",
                      priority: true,
                      quality: 100,
                      maxWidth: "200px",
                      margin: { all: "0 auto" },
                      padding: { all: "0" },
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    type: "CardBlock",
                    props: {
                      id: "login-card",
                      showHeader: true,
                      title: "Login",
                      description:
                        "Enter your credentials to access your account",
                      showFooter: false,
                      backgroundColor: { colorKey: "card" },
                      borderColor: { colorKey: "border" },
                      shadow: "md",
                      margin: { all: "0 auto" },
                      padding: { all: "24px" },
                      className: "max-w-md w-full",
                      items: [
                        {
                          content: [
                            {
                              type: "FormBlock",
                              props: {
                                id: "login-form",
                                template: "login",
                                customFields: [],
                                styling: {
                                  layout: "vertical",
                                  spacing: "normal",
                                  buttonStyle: "primary",
                                  buttonText: "Login",
                                  buttonSize: "default",
                                  fieldSpacing: "md",
                                  buttonFullWidth: false,
                                },
                                className: "",
                              },
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              type: "FlexBlock",
                              props: {
                                id: "remember-forgot-row",
                                direction: "row",
                                justify: "space-between",
                                gap: "8px",
                                padding: { all: "0" },
                                margin: {
                                  top: "8px",
                                  right: "0",
                                  bottom: "0",
                                  left: "0",
                                },
                                className: "w-full",
                                items: [
                                  {
                                    content: [
                                      {
                                        type: "FormBlock",
                                        props: {
                                          id: "remember-me-form",
                                          template: "login-remember-me",
                                          customFields: [],
                                          styling: {
                                            layout: "vertical",
                                            spacing: "tight",
                                            buttonStyle: "primary",
                                            buttonText: "",
                                            buttonSize: "default",
                                            fieldSpacing: "sm",
                                            buttonFullWidth: false,
                                          },
                                          className: "",
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    content: [
                                      {
                                        type: "LinkBlock",
                                        props: {
                                          id: "forgot-password-link",
                                          text: "Forgot password?",
                                          href: "/forgot-password",
                                          isExternal: false,
                                          textColor: { colorKey: "primary" },
                                          padding: { all: "0" },
                                          margin: { all: "0" },
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              type: "ButtonBlock",
                              props: {
                                id: "login-button",
                                text: "Login",
                                variant: "default",
                                size: "default",
                                backgroundColor: { colorKey: "primary" },
                                textColor: { colorKey: "primary-foreground" },
                                href: "#",
                                isExternal: false,
                                margin: {
                                  top: "16px",
                                  right: "0",
                                  bottom: "0",
                                  left: "0",
                                },
                                padding: { all: "0" },
                                className: "w-full",
                              },
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              type: "FlexBlock",
                              props: {
                                id: "register-row",
                                direction: "row",
                                gap: "4px",
                                padding: { all: "0" },
                                margin: {
                                  top: "16px",
                                  right: "0",
                                  bottom: "0",
                                  left: "0",
                                },
                                className: "justify-between w-full",
                                items: [
                                  {
                                    content: [
                                      {
                                        type: "TextBlock",
                                        props: {
                                          id: "register-text",
                                          text: "Don't have an account?",
                                          align: "left",
                                          size: "sm",
                                          color: {
                                            colorKey: "muted-foreground",
                                          },
                                          margin: { all: "0" },
                                          padding: { all: "0" },
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    content: [
                                      {
                                        type: "LinkBlock",
                                        props: {
                                          id: "register-link",
                                          text: "Register here",
                                          href: "/register",
                                          isExternal: false,
                                          textColor: {
                                            colorKey: "primary",
                                          },
                                          padding: { all: "0" },
                                          margin: { all: "0" },
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              type: "FlexBlock",
                              props: {
                                id: "social-login-container",
                                direction: "column",
                                gap: "12px",
                                padding: {
                                  top: "24px",
                                  right: "0",
                                  bottom: "0",
                                  left: "0",
                                },
                                margin: {
                                  top: "24px",
                                  right: "0",
                                  bottom: "0",
                                  left: "0",
                                },
                                items: [
                                  {
                                    content: [
                                      {
                                        type: "TextBlock",
                                        props: {
                                          id: "social-login-divider",
                                          text: "Or continue with",
                                          align: "center",
                                          size: "sm",
                                          color: {
                                            colorKey: "muted-foreground",
                                          },
                                          margin: { all: "0" },
                                          padding: { all: "0" },
                                        },
                                      },
                                    ],
                                  },
                                  {
                                    content: [
                                      {
                                        type: "FlexBlock",
                                        props: {
                                          id: "social-login-buttons",
                                          direction: "column",
                                          gap: "8px",
                                          padding: { all: "0" },
                                          margin: { all: "0" },
                                          items: [
                                            {
                                              content: [
                                                {
                                                  type: "ButtonBlock",
                                                  props: {
                                                    id: "google-login-btn",
                                                    text: "Google",
                                                    variant: "outline",
                                                    size: "default",
                                                    icon: "Chrome",
                                                    iconPosition: "left",
                                                    backgroundColor: {
                                                      colorKey: "background",
                                                    },
                                                    textColor: {
                                                      colorKey: "foreground",
                                                    },
                                                    href: "/api/auth/google",
                                                    isExternal: false,
                                                    margin: { all: "0" },
                                                    padding: { all: "0" },
                                                    className: "w-full",
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "ButtonBlock",
                                                  props: {
                                                    id: "facebook-login-btn",
                                                    text: "Facebook",
                                                    variant: "outline",
                                                    size: "default",
                                                    icon: "Facebook",
                                                    iconPosition: "left",
                                                    backgroundColor: {
                                                      colorKey: "background",
                                                    },
                                                    textColor: {
                                                      colorKey: "foreground",
                                                    },
                                                    href: "/api/auth/facebook",
                                                    isExternal: false,
                                                    margin: { all: "0" },
                                                    padding: { all: "0" },
                                                    className: "w-full",
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "ButtonBlock",
                                                  props: {
                                                    id: "x-login-btn",
                                                    text: "X",
                                                    variant: "outline",
                                                    size: "default",
                                                    icon: "Twitter",
                                                    iconPosition: "left",
                                                    backgroundColor: {
                                                      colorKey: "background",
                                                    },
                                                    textColor: {
                                                      colorKey: "foreground",
                                                    },
                                                    href: "/api/auth/x",
                                                    isExternal: false,
                                                    margin: { all: "0" },
                                                    padding: { all: "0" },
                                                    className: "w-full",
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "ButtonBlock",
                                                  props: {
                                                    id: "epic-games-login-btn",
                                                    text: "Epic",
                                                    variant: "outline",
                                                    size: "default",
                                                    icon: "Gamepad2",
                                                    iconPosition: "left",
                                                    backgroundColor: {
                                                      colorKey: "background",
                                                    },
                                                    textColor: {
                                                      colorKey: "foreground",
                                                    },
                                                    href: "/api/auth/epic",
                                                    isExternal: false,
                                                    margin: { all: "0" },
                                                    padding: { all: "0" },
                                                    className: "w-full",
                                                  },
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      zones: {},
    },
    "/register": {
      root: { props: { title: "Register 123123" } },
      content: [
        {
          type: "ContainerBlock",
          props: {
            id: "register-container",
            width: "container",
            padding: {
              top: "48px",
              right: "24px",
              bottom: "48px",
              left: "24px",
            },
            backgroundColor: { colorKey: "background" },
            items: [
              {
                content: [
                  {
                    type: "HeadingBlock",
                    props: {
                      id: "register-heading",
                      level: "h1",
                      text: "Register",
                      align: "center",
                      size: "3xl",
                      weight: "bold",
                      color: { colorKey: "foreground" },
                      margin: { all: "0" },
                      padding: { all: "0" },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      zones: {},
    },
    "/checkout": {
      root: { props: { title: "Checkout" } },
      content: [
        {
          type: "ContainerBlock",
          props: {
            id: "checkout-container",
            width: "container",
            padding: {
              top: "48px",
              right: "24px",
              bottom: "48px",
              left: "24px",
            },
            backgroundColor: { colorKey: "background" },
            items: [
              {
                content: [
                  {
                    type: "HeadingBlock",
                    props: {
                      id: "checkout-heading",
                      level: "h1",
                      text: "Checkout",
                      align: "center",
                      size: "3xl",
                      weight: "bold",
                      color: { colorKey: "foreground" },
                      margin: { all: "0" },
                      padding: { all: "0" },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      zones: {},
    },
    "/terms-and-conditions": {
      root: { props: { title: "Terms and Conditions" } },
      content: [
        {
          type: "ContainerBlock",
          props: {
            id: "terms-container",
            width: "container",
            padding: {
              top: "48px",
              right: "24px",
              bottom: "48px",
              left: "24px",
            },
            backgroundColor: { colorKey: "background" },
            items: [
              {
                content: [
                  {
                    type: "HeadingBlock",
                    props: {
                      id: "terms-heading",
                      level: "h1",
                      text: "Terms and Conditions",
                      align: "left",
                      size: "3xl",
                      weight: "bold",
                      color: { colorKey: "foreground" },
                      margin: { all: "0" },
                      padding: { all: "0" },
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    type: "TextBlock",
                    props: {
                      id: "terms-content",
                      text: "Please add your terms and conditions content here.",
                      align: "left",
                      size: "base",
                      color: { colorKey: "foreground" },
                      margin: { all: "0" },
                      padding: { all: "0" },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      zones: {},
    },
    "/privacy-policy": {
      root: { props: { title: "Privacy Policy" } },
      content: [
        {
          type: "ContainerBlock",
          props: {
            id: "privacy-container",
            width: "container",
            padding: {
              top: "48px",
              right: "24px",
              bottom: "48px",
              left: "24px",
            },
            backgroundColor: { colorKey: "background" },
            items: [
              {
                content: [
                  {
                    type: "HeadingBlock",
                    props: {
                      id: "privacy-heading",
                      level: "h1",
                      text: "Privacy Policy",
                      align: "left",
                      size: "3xl",
                      weight: "bold",
                      color: { colorKey: "foreground" },
                      margin: { all: "0" },
                      padding: { all: "0" },
                    },
                  },
                ],
              },
              {
                content: [
                  {
                    type: "TextBlock",
                    props: {
                      id: "privacy-content",
                      text: "Please add your privacy policy content here.",
                      align: "left",
                      size: "base",
                      color: { colorKey: "foreground" },
                      margin: { all: "0" },
                      padding: { all: "0" },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      zones: {},
    },
  };
}
