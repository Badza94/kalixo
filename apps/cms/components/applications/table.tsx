"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";
import {
  Brain,
  Sparkles,
  Bot,
  Youtube,
  Mail,
  HelpCircle,
  Building2,
  MessageCircle,
  BarChart,
  LineChart,
  Table2,
  CreditCard,
} from "@workspace/ui/lucide-react";
import ConfigureApplicationDialog from "./configure-dialog";

// TikTok custom icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.302-1.79-1.302-2.724V1.3H13.91v11.2c0 1.302-.849 2.362-1.936 2.362-1.087 0-1.936-1.06-1.936-2.362s.849-2.362 1.936-2.362c.302 0 .593.06.85.151V7.96c-.273-.06-.561-.091-.85-.091-2.753 0-4.987 2.234-4.987 4.987 0 2.754 2.234 4.988 4.987 4.988 2.754 0 4.987-2.234 4.987-4.988V9.033c1.06.6 2.28.938 3.6.938v-3.05c-.698 0-1.376-.15-1.996-.423z" />
  </svg>
);

// Twitch custom icon component
const TwitchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h2.857L20.571 13.14V0zm12.857 12.185L15.428 15.6h-2.857l-2.571 2.571v-2.571H6.857V1.714h12z" />
  </svg>
);

interface Application {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | (() => React.ReactNode);
  keyName: string;
  path: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
  }>;
  disabled?: boolean;
  encryptedData?: Record<string, string>;
}

interface ApplicationSection {
  name: string;
  applications: Application[];
}

const applicationsData: ApplicationSection[] = [
  {
    name: "aiMachineLearning",
    applications: [
      {
        title: "OpenAI",
        description: "Integrate GPT models and DALL-E for AI capabilities",
        icon: Brain,
        keyName: "OPENAI",
        path: "/applications/openai",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
            placeholder: "sk-...",
          },
        ],
        encryptedData: {
          api_key: "sk-proj-encrypted_value_here",
        },
      },
      {
        title: "DeepSeek",
        description: "Access advanced language models and AI tools",
        icon: Sparkles,
        keyName: "DEEPSEEK",
        path: "/applications/deepseek",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
        ],
      },
      {
        title: "Perplexity",
        description: "Leverage powerful AI models for text analysis",
        icon: Bot,
        keyName: "PERPLEXITY",
        path: "/applications/perplexity",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: "socialMedia",
    applications: [
      {
        title: "YouTube",
        description: "Integrate and manage YouTube API for video content",
        icon: Youtube,
        keyName: "YOUTUBE_API_KEY",
        path: "/applications/youtube",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
          {
            name: "channel_id",
            label: "Channel ID",
            type: "text",
            required: true,
          },
        ],
        encryptedData: {
          api_key: "AIzaSyEncryptedValue123",
          channel_id: "UCEncryptedChannelId456",
        },
      },
      {
        title: "Twitch",
        description: "Connect with Twitch streaming platform",
        icon: TwitchIcon,
        keyName: "TWITCH_API_KEY",
        path: "/applications/twitch",
        fields: [
          {
            name: "client_id",
            label: "Client ID",
            type: "text",
            required: true,
          },
          {
            name: "client_secret",
            label: "Client Secret",
            type: "password",
            required: true,
          },
        ],
      },
      {
        title: "TikTok",
        description: "Connect with TikTok for social media marketing",
        icon: TikTokIcon,
        keyName: "TIKTOK",
        path: "/applications/tiktok",
        fields: [
          {
            name: "app_id",
            label: "App ID",
            type: "text",
            required: true,
          },
          {
            name: "app_secret",
            label: "App Secret",
            type: "password",
            required: true,
          },
        ],
        disabled: true,
      },
    ],
  },
  {
    name: "marketing",
    applications: [
      {
        title: "Klaviyo",
        description: "Email and SMS marketing automation platform",
        icon: Mail,
        keyName: "KLAVIYO",
        path: "/applications/klaviyo",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
          {
            name: "company_id",
            label: "Company ID",
            type: "text",
            required: true,
          },
        ],
      },
      {
        title: "Mailchimp",
        description: "Email marketing and automation platform",
        icon: Mail,
        keyName: "MAILCHIMP",
        path: "/applications/mailchimp",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
          {
            name: "server_prefix",
            label: "Server Prefix",
            type: "text",
            required: true,
            placeholder: "us1",
          },
        ],
      },
      {
        title: "SendGrid",
        description: "Email delivery and marketing platform",
        icon: Mail,
        keyName: "SENDGRID",
        path: "/applications/sendgrid",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: "customerSupport",
    applications: [
      {
        title: "Freshdesk",
        description: "Customer support and ticketing system",
        icon: HelpCircle,
        keyName: "FRESHDESK",
        path: "/applications/freshdesk",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
          {
            name: "domain",
            label: "Domain",
            type: "text",
            required: true,
            placeholder: "yourcompany.freshdesk.com",
          },
        ],
      },
      {
        title: "Zoho Desk",
        description: "Customer service and support platform",
        icon: Building2,
        keyName: "ZOHO_DESK",
        path: "/applications/zoho-desk",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
          {
            name: "organization_id",
            label: "Organization ID",
            type: "text",
            required: true,
          },
        ],
      },
      {
        title: "Intercom",
        description: "Customer messaging and support platform",
        icon: MessageCircle,
        keyName: "INTERCOM",
        path: "/applications/intercom",
        fields: [
          {
            name: "access_token",
            label: "Access Token",
            type: "password",
            required: true,
          },
          {
            name: "app_id",
            label: "App ID",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: "analytics",
    applications: [
      {
        title: "Hotjar",
        description: "Track user behavior and feedback",
        icon: BarChart,
        keyName: "HOTJAR_SITE_ID",
        path: "/applications/hotjar",
        fields: [
          {
            name: "site_id",
            label: "Site ID",
            type: "text",
            required: true,
          },
        ],
      },
      {
        title: "Google Analytics",
        description: "Monitor website traffic and user engagement",
        icon: LineChart,
        keyName: "GA_MEASUREMENT_ID",
        path: "/applications/google-analytics",
        fields: [
          {
            name: "measurement_id",
            label: "Measurement ID",
            type: "text",
            required: true,
            placeholder: "G-XXXXXXXXXX",
          },
        ],
        encryptedData: {
          measurement_id: "G-ENCRYPTED123456",
        },
      },
      {
        title: "Google Tag Manager",
        description: "Manage and deploy marketing tags",
        icon: Table2,
        keyName: "GTM_CONTAINER_ID",
        path: "/applications/google-tag-manager",
        fields: [
          {
            name: "container_id",
            label: "Container ID",
            type: "text",
            required: true,
            placeholder: "GTM-XXXXXXX",
          },
        ],
      },
    ],
  },
  {
    name: "businessFinance",
    applications: [
      {
        title: "Stripe",
        description: "Payment processing and subscription management",
        icon: CreditCard,
        keyName: "STRIPE",
        path: "/applications/stripe",
        fields: [
          {
            name: "secret_key",
            label: "Secret Key",
            type: "password",
            required: true,
            placeholder: "sk_...",
          },
          {
            name: "publishable_key",
            label: "Publishable Key",
            type: "text",
            required: true,
            placeholder: "pk_...",
          },
        ],
        encryptedData: {
          secret_key: "sk_live_encrypted_secret_key_value",
          publishable_key: "pk_live_encrypted_publishable_key_value",
        },
      },
      {
        title: "Zoho",
        description: "CRM and business management integration",
        icon: Building2,
        keyName: "ZOHO_API_KEY",
        path: "/applications/zoho",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
          {
            name: "organization_id",
            label: "Organization ID",
            type: "text",
            required: true,
          },
        ],
      },
      {
        title: "Adyen",
        description: "Payment processing and financial services",
        icon: CreditCard,
        keyName: "ADYEN_API_KEY",
        path: "/applications/adyen",
        fields: [
          {
            name: "api_key",
            label: "API Key",
            type: "password",
            required: true,
          },
          {
            name: "merchant_account",
            label: "Merchant Account",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  },
];

function ApplicationsTable() {
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("Applications");

  const handleConfigureClick = (app: Application) => {
    setSelectedApplication(app);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {applicationsData.map((section) => (
        <div key={section.name} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t(`sections.${section.name}`)}
          </h2>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {section.applications.map((app) => {
              const IconComponent = app.icon;
              return (
                <Card
                  key={app.keyName}
                  className={`flex flex-col ${app.disabled ? "opacity-50" : ""}`}
                >
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{app.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t(`apps.${app.keyName.toLowerCase()}.description`)}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={app.disabled}
                      onClick={() => handleConfigureClick(app)}
                    >
                      {app.encryptedData ? t("edit") : t("configure")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <ConfigureApplicationDialog
        application={selectedApplication}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

export default ApplicationsTable;
