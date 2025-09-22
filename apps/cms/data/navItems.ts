import {
  AppWindow,
  Building2,
  Globe,
  Layout,
  Megaphone,
  MonitorCog,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "@workspace/ui/lucide-react";

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: LucideIcon;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}
export const navItems: NavItem[] = [
  {
    title: "dashboard",
    url: "/dashboard",
    icon: Layout,
    isActive: false,
    shortcut: ["a", "a"],
    items: [
      {
        title: "analytics",
        url: "/analytics",
        shortcut: ["a", "b"],
      },
      {
        title: "operation",
        url: "/operation",
        shortcut: ["a", "c"],
      },
    ],
  },
  {
    title: "products",
    url: "/products",
    icon: ShoppingBag,
    isActive: false,
    shortcut: ["b", "a"],
    items: [
      {
        title: "collections",
        url: "/collections",
        shortcut: ["b", "b"],
      },
      {
        title: "payouts",
        url: "/payouts",
        shortcut: ["b", "c"],
      },
      {
        title: "attributes",
        url: "/attributes",
        shortcut: ["b", "d"],
      },
    ],
  },
  {
    title: "orders",
    url: "/orders",
    icon: ShoppingCart,
    isActive: false,
    shortcut: ["c", "a"],
    items: [
      {
        title: "placeOrder",
        url: "/place-order",
        shortcut: ["c", "b"],
      },
      {
        title: "drafts",
        url: "/drafts",
        shortcut: ["c", "c"],
      },
    ],
  },
  {
    title: "customers",
    url: "/customers",
    icon: Users,
    isActive: false,
    shortcut: ["d", "a"],
    items: [
      {
        title: "segments",
        url: "/segments",
        shortcut: ["d", "b"],
      },
    ],
  },
  {
    title: "channels",
    url: "/channels",
    icon: Globe,
    isActive: false,
    shortcut: ["e", "a"],
    items: [
      {
        title: "create",
        url: "/create",
        shortcut: ["e", "b"],
      },
    ],
  },
  {
    title: "marketing",
    url: "/marketing",
    icon: Megaphone,
    isActive: false,
    shortcut: ["f", "a"],
    items: [
      {
        title: "promotions",
        url: "/promotions",
        shortcut: ["f", "b"],
      },
      {
        title: "campaigns",
        url: "/campaigns",
        shortcut: ["f", "c"],
      },
    ],
  },
  {
    title: "finance",
    url: "/finance",
    icon: Building2,
    isActive: false,
    shortcut: ["g", "a"],
    items: [
      {
        title: "balance",
        url: "/balance",
        shortcut: ["g", "b"],
      },
      {
        title: "companies",
        url: "/companies",
        shortcut: ["g", "c"],
      },
      {
        title: "invoices",
        url: "/invoices",
        shortcut: ["g", "d"],
      },
      {
        title: "pricingTable",
        url: "/pricing-table",
        shortcut: ["g", "e"],
      },
      {
        title: "reports",
        url: "/reports",
        shortcut: ["g", "f"],
      },
      {
        title: "transactions",
        url: "/transactions",
        shortcut: ["g", "h"],
      },
    ],
  },
  {
    title: "applications",
    url: "/applications",
    icon: AppWindow,
    isActive: false,
    shortcut: ["h", "a"],
    items: [],
  },
  {
    title: "settings",
    url: "/settings",
    icon: Settings,
    isActive: false,
    shortcut: ["i", "a"],
    items: [
      {
        title: "API",
        url: "/api",
        shortcut: ["i", "b"],
      },
      {
        title: "users",
        url: "/users",
        shortcut: ["i", "c"],
      },
      {
        title: "roles",
        url: "/roles",
        shortcut: ["i", "d"],
      },
      {
        title: "securitySettings",
        url: "/security",
        shortcut: ["i", "e"],
      },
      {
        title: "markets",
        url: "/markets",
        shortcut: ["i", "f"],
      },
      {
        title: "translationManagement",
        url: "/translations",
        shortcut: ["i", "g"],
      },
    ],
  },
  {
    title: "developers",
    url: "/developers",
    icon: MonitorCog,
    isActive: false,
    shortcut: ["j", "a"],
    items: [],
  },
];
