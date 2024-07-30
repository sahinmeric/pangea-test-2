const routes = {
  base: "/",
  home: "/home",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  user: "/user",
  zapFeed: "/zap-feed",
  invoicing: "/invoicing",
  campaigns: "/campaigns",
  search: "/search",
  trackers: "/search/trackers",
  blitzpay: "/blitzpay",
  addCreators: "/add-creators/:campaignId",
  resources: "/resources",
  about: "/about",
  creatorSignup: "/creatorsignup",
  company: "/company",
  campaignReport: "/campaigns/:campaignId",
  campaignTimeline: "/campaigns/:campaignId/timelines",
  creatorCampaignTimeline: "/campaigns/:campaignId/creator/:creatorId/timelines", // Add this line for the new route
  creatorMediaKit: "/creators/:creatorId",
  roster: "/roster/:manager", // New route for the AgencyCreatorRoster component
  tempRoster: "/temp_roster/:manager", // New route for the AgencyCreatorRoster component
  creatorConnect: "/creatorconnect/:creator",
  creatorLogin: "/creatorconnect/login",
  internalLogin: "/creatorconnect/internal_login",
  creatorConnectCampaigns: "/creatorconnect/campaigns",
  creatorConnectStart: "/creatorconnect/start",
  creatorConnectStripe: "/creatorconnect/start/stripe",
  creatorConnectOnboard: "/creatorconnect/onboard",
  commisions: "/commissions",
  creatorPayoutInvoices: "/creatorinvoice",
  creatorCRMPublic: "/creatorCRM",
  requestAccess: "/requestaccess",
  similarCreators: "/creators/:creatorId/similar",
  demoRegister: "/demoregister",
  about: "/about",
  deliverablePage: "/partnerships/:partnershipId/creator/:creatorId/deliverables", // Add this line for the new route
  tempCreator: "/tempCreator/:creatorId",

};

export default routes;
