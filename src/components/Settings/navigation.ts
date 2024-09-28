import messages from "../../i18n/messages";

const navigation = {
  user: [{ name: messages.profile, href: "/settings/profile" }],
  organization: [
    { name: messages.orgDetails, href: "/settings/legal" },
    { name: messages.team, href: "/settings/members" },
    { name: messages.branding, href: "/settings/branding" },
    { name: messages.shop, href: "/settings/shop" },
  ],
  taxAndContracts: [
    { name: messages.payout, href: "/settings/payout" },
    { name: messages.taxDetails, href: "/settings/taxes" },
    { name: messages.deals, href: "/settings/deals" },
    { name: messages.locations, href: "/settings/locations" },
  ],
  price: [
    { name: messages.priceNames, href: "/settings/pricenames" },
    { name: messages.priceCategories, href: "/settings/pricecategories" },
    { name: messages.priceTemplates, href: "/settings/pricetemplates" },
    { name: messages.promoCode, href: "/settings/promocode" }
  ],
};

export default navigation;
