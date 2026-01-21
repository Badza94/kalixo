import { Data } from "@puckeditor/core";

// List of pages that cannot be edited
export const READ_ONLY_PAGES = ["/login", "/register", "/checkout", "/forgot-password", "/reset-password"];

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
          type: "LoginBlock",
          props: {
            id: "LoginBlock-main",
            logoSrc: "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
            showSocialLogin: true,
            showRememberMe: true,
            showForgotPassword: true,
          },
        },
      ],
      zones: {},
    },
    "/register": {
      root: { props: { title: "Register" } },
      content: [
        {
          type: "RegisterBlock",
          props: {
            id: "RegisterBlock-main",
            logoSrc: "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
            showSocialLogin: true,
          },
        },
      ],
      zones: {},
    },
    "/forgot-password": {
      root: { props: { title: "Forgot Password" } },
      content: [
        {
          type: "ForgotPasswordBlock",
          props: {
            id: "ForgotPasswordBlock-main",
            logoSrc: "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
          },
        },
      ],
      zones: {},
    },
    "/reset-password": {
      root: { props: { title: "Reset Password" } },
      content: [
        {
          type: "ResetPasswordBlock",
          props: {
            id: "ResetPasswordBlock-main",
            logoSrc: "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
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
    "/my-account": {
      root: { props: { title: "My Account" } },
      content: [
        {
          type: "NavigationBlock",
          props: {
            type: "header",
            logo: "/shared/1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.png",
            position: "fixed",
            items: [
              { id: "2", label: "Collections", href: "#" },
              { id: "3", label: "About", href: "#" },
              { id: "4", label: "Contact", href: "#" },
            ],
            showSearch: true,
            showCart: true,
            showWishlist: true,
            showAccount: true,
            cartCount: 2,
            id: "NavigationBlock-account-header",
            textColor: { colorKey: "foreground" },
            backgroundColor: { colorKey: "glass", customColor: "#000000" },
            fontSize: "md",
          },
        },
        {
          type: "MyAccountLayoutBlock",
          props: {
            defaultSection: "info",
          },
        },
        {
          type: "ContainerBlock",
          props: {
            width: "full",
            padding: {
              top: "48px",
              right: "24px",
              bottom: "48px",
              left: "24px",
            },
            backgroundColor: {
              colorKey: "foreground",
              customColor: "#000000",
            },
            shadow: "none",
            items: [
              {
                content: [
                  {
                    type: "GridBlock",
                    props: {
                      id: "GridBlock-footer-main",
                      columns: 1,
                      gap: "lg",
                      items: [
                        {
                          content: [
                            {
                              type: "ImageBlock",
                              props: {
                                id: "ImageBlock-footer-logo",
                                src: "/shared/1762433192335_1761737088204_b742e01c0593e08227738af44b50550208c3b3e3.webp",
                                alt: "Logo",
                                width: 120,
                                height: 40,
                                fill: false,
                                maxWidth: "120",
                                quality: 100,
                              },
                            },
                          ],
                        },
                        {
                          content: [
                            {
                              type: "FlexBlock",
                              props: {
                                id: "FlexBlock-categories",
                                direction: "column",
                                gap: "16px",
                                padding: { all: "0" },
                                margin: { all: "0" },
                                items: [
                                  {
                                    content: [
                                      {
                                        type: "HeadingBlock",
                                        props: {
                                          id: "HeadingBlock-categories-title",
                                          level: "h3",
                                          text: "CATEGORIES",
                                          align: "left",
                                          size: "sm",
                                          weight: "bold",
                                          color: {
                                            colorKey: "secondary",
                                            customColor: "#ffffff",
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
                                          id: "FlexBlock-categories-links",
                                          direction: "column",
                                          gap: "12px",
                                          padding: { all: "0" },
                                          margin: { all: "0" },
                                          items: [
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-xbox",
                                                    text: "Xbox",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-pc",
                                                    text: "PC",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-nintendo",
                                                    text: "Nintendo",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-appstore",
                                                    text: "App Store and iTunes",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-playstation",
                                                    text: "PlayStation",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-entertainment",
                                                    text: "Entertainment",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
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
                                id: "FlexBlock-legal",
                                direction: "column",
                                gap: "16px",
                                padding: { all: "0" },
                                margin: { all: "0" },
                                items: [
                                  {
                                    content: [
                                      {
                                        type: "HeadingBlock",
                                        props: {
                                          id: "HeadingBlock-legal-title",
                                          level: "h3",
                                          text: "LEGAL",
                                          align: "left",
                                          size: "sm",
                                          weight: "bold",
                                          color: {
                                            colorKey: "secondary",
                                            customColor: "#ffffff",
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
                                          id: "FlexBlock-legal-links",
                                          direction: "column",
                                          gap: "12px",
                                          padding: { all: "0" },
                                          margin: { all: "0" },
                                          items: [
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-terms",
                                                    text: "Terms",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-privacy",
                                                    text: "Privacy Policy",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-cookies",
                                                    text: "Cookies",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
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
                                id: "FlexBlock-support",
                                direction: "column",
                                gap: "16px",
                                padding: { all: "0" },
                                margin: { all: "0" },
                                items: [
                                  {
                                    content: [
                                      {
                                        type: "HeadingBlock",
                                        props: {
                                          id: "HeadingBlock-support-title",
                                          level: "h3",
                                          text: "SUPPORT",
                                          align: "left",
                                          size: "sm",
                                          weight: "bold",
                                          color: {
                                            colorKey: "secondary",
                                            customColor: "#ffffff",
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
                                          id: "FlexBlock-support-links",
                                          direction: "column",
                                          gap: "12px",
                                          padding: { all: "0" },
                                          margin: { all: "0" },
                                          items: [
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-faqs",
                                                    text: "FAQs",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-help",
                                                    text: "Help Centre",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-contact",
                                                    text: "Contact",
                                                    href: "#",
                                                    isExternal: false,
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
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
                                id: "FlexBlock-social",
                                direction: "column",
                                gap: "16px",
                                padding: { all: "0" },
                                margin: { all: "0" },
                                items: [
                                  {
                                    content: [
                                      {
                                        type: "FlexBlock",
                                        props: {
                                          id: "FlexBlock-social-icons",
                                          direction: "row",
                                          gap: "12px",
                                          padding: { all: "0" },
                                          margin: { all: "0" },
                                          items: [
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-facebook",
                                                    text: "",
                                                    href: "https://facebook.com",
                                                    isExternal: true,
                                                    icon: "Facebook",
                                                    iconPosition: "left",
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-twitter",
                                                    text: "",
                                                    href: "https://twitter.com",
                                                    isExternal: true,
                                                    icon: "Twitter",
                                                    iconPosition: "left",
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-instagram",
                                                    text: "",
                                                    href: "https://instagram.com",
                                                    isExternal: true,
                                                    icon: "Instagram",
                                                    iconPosition: "left",
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
                                                    },
                                                    padding: { all: "0" },
                                                    margin: { all: "0" },
                                                  },
                                                },
                                              ],
                                            },
                                            {
                                              content: [
                                                {
                                                  type: "LinkBlock",
                                                  props: {
                                                    id: "LinkBlock-linkedin",
                                                    text: "",
                                                    href: "https://linkedin.com",
                                                    isExternal: true,
                                                    icon: "Linkedin",
                                                    iconPosition: "left",
                                                    textColor: {
                                                      colorKey: "secondary",
                                                      customColor: "#ffffff",
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
                                ],
                              },
                            },
                          ],
                        },
                      ],
                      maxWidth: "1280px",
                      margin: {
                        top: "0",
                        right: "auto",
                        bottom: "0",
                        left: "auto",
                      },
                      columnsMd: 5,
                      columnsSm: 2,
                    },
                  },
                ],
              },
            ],
            id: "ContainerBlock-footer-main",
            maxWidth: "",
            margin: {
              top: "0",
              right: "auto",
              bottom: "0",
              left: "auto",
            },
            spacing: { y: "0", x: "" },
          },
        },
      ],
      zones: {},
    },
  };
}
