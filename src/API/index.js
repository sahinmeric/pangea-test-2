import { API_ENDPOINTS } from "./endpoints";
import { HttpClient } from "./http-client";

class Client {
  users = {
    login: (input) => HttpClient.post(API_ENDPOINTS.USERS_LOGIN, input),
    register: (input) => HttpClient.post(API_ENDPOINTS.USERS_REGISTER, input),
    fetchUser: () => HttpClient.get(API_ENDPOINTS.FETCH_USER),
    userKPI: () => HttpClient.get(API_ENDPOINTS.USERS_KPI),
    userDetails: () => HttpClient.get(API_ENDPOINTS.USERS_DETAILS),
    access: (input) => HttpClient.post(API_ENDPOINTS.REQUEST_ACCESS_CRM, input),
    userAdminFetch: () => HttpClient.get(API_ENDPOINTS.USER_ADMIN_FETCH),
    creatorUserAdminFetch: () => HttpClient.get(API_ENDPOINTS.CREATOR_USER_ADMIN_FETCH),

    editUserWithCredits: (input) => HttpClient.post(API_ENDPOINTS.USER_ADMIN_EDIT, input),
    editCreatorWithCredits: (input) => HttpClient.post(API_ENDPOINTS.CREATOR_CREDITS_ADMIN_EDIT, input),

    fetchSharedWith: () => HttpClient.get(API_ENDPOINTS.SHARED_WITH_ADMIN),
  }
  campaigns = {
    launch: (input) => HttpClient.post(API_ENDPOINTS.LAUNCH_CAMPAIGN, input),
    resendLaunch: (input) => HttpClient.post(API_ENDPOINTS.RESEND_LAUNCH, input),
    sendPostingInstructions: (input) =>
      HttpClient.post(API_ENDPOINTS.SEND_POSTING_INSTRUCTIONS, input),
    list: () => HttpClient.get(API_ENDPOINTS.CAMPAIGNS),
    details: (id) => HttpClient.get(API_ENDPOINTS.CAMPAIGNS_DETAILS(id)),
    timeline_edit: (id, input) => HttpClient.put(API_ENDPOINTS.CAMPAIGNS_TIMELINE(id), input),
    timeline_by_creator: (id, creatorId) => HttpClient.get(API_ENDPOINTS.CAMPAIGNS_TIMELINE_BY_CREATOR(id, creatorId)),
    timeline_by_creator_update: (id, creatorId, input) => HttpClient.put(API_ENDPOINTS.CAMPAIGNS_TIMELINE_BY_CREATOR(id, creatorId), input),
    listAdmin: () => HttpClient.get(API_ENDPOINTS.CAMPAIGNS_ADMIN),
    listKPI: () => HttpClient.get(API_ENDPOINTS.CAMPAIGNS_ADMIN_KPI),

    create: (input) => HttpClient.post(API_ENDPOINTS.CAMPAIGNS, input),
    fetch: (input) => HttpClient.get(`${API_ENDPOINTS.CAMPAIGNS}${input}`),
    update: (input) => HttpClient.post(API_ENDPOINTS.UPDATE_CAMPAIGN, input),
    updateCreatorList: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CREATOR_LIST, input),
    updateCreatorDetails: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CREATOR_DETAILS, input),
    removeCreators: (input) =>
      HttpClient.post(API_ENDPOINTS.REMOVE_CREATORS, input),
    updateCreatorPrices: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CREATOR_PRICES, input),
    updateCampaignSum: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_CAMPAIGN_SUM, input),
    updateLinksCodes: (input) =>
      HttpClient.post(API_ENDPOINTS.UPDATE_LINKS_CODES, input),
    complete: (input) =>
      HttpClient.post(
        `${API_ENDPOINTS.COMPLETE_CAMPAIGN}/${input.index}`,
        input.params
      ),
    delete: (input) => HttpClient.post(API_ENDPOINTS.DELETE_CAMPAIGN, input),
    generateReport: (input) =>
      HttpClient.post(API_ENDPOINTS.GENERATE_REPORT, input),
    editAdmin: (input) =>
      HttpClient.post(API_ENDPOINTS.EDIT_CAMPAIGN_ADMIN, input),
    deleteCampaignAdmin: (input) =>
      HttpClient.post(API_ENDPOINTS.DELETE_CAMPAIGN_ADMIN, input),
    fetchAdmin: (input) => HttpClient.get(`${API_ENDPOINTS.CAMPAIGNS}${input}`),

  };

  payouts = {
    list: () => HttpClient.get(API_ENDPOINTS.PAYOUTS),
    create: (input) => HttpClient.post(API_ENDPOINTS.PAYOUTS, input),
    delete: (input) => HttpClient.post(API_ENDPOINTS.PAYOUT_DELETE, input),
    listAdmin: () => HttpClient.get(API_ENDPOINTS.PAYOUTS_ADMIN),
    deleteAdmin: (input) => HttpClient.post(API_ENDPOINTS.DELETE_PAYOUTS_ADMIN, input),
    editAdmin: (input) => HttpClient.post(API_ENDPOINTS.PAYOUTS_EDIT_ADMIN, input),
    createBatch: (input) => HttpClient.post(API_ENDPOINTS.CREATE_BATCH_PAYOUTL, input),

  };

  creators = {
    list: (params = null) => HttpClient.get(API_ENDPOINTS.CREATORS, params),
    emails: () => HttpClient.get(API_ENDPOINTS.CREATOR_EMAILS),
    listKPI: () => HttpClient.get(API_ENDPOINTS.CREATORS_KPI),
    listManager: (agencyid) => {
      const url = `${API_ENDPOINTS.CREATORS_MANAGER}${agencyid}`;
      console.log(`Fetching creator details from: ${url}`);
      return HttpClient.get(url);
    },
    add: (input) => HttpClient.post(API_ENDPOINTS.CREATOR_ADD, input),
    update: (input) => HttpClient.put(API_ENDPOINTS.CREATOR_UPDATE, input),
    delete: (input) => HttpClient.post(API_ENDPOINTS.CREATOR_DELETE, input),

    payout: (input) =>
      HttpClient.get(API_ENDPOINTS.CREATOR_PAYOUT_READ, { sheetId: input }),
    data: () => HttpClient.get(API_ENDPOINTS.CREATOR_DATA_READ),
    fetchDetails: (creatorId) => {
      const url = `${API_ENDPOINTS.CREATORS_SPEC}${creatorId}`;
      return HttpClient.get(url);
    },
    fetchSimilar: (creatorId) => {
      const url = `${API_ENDPOINTS.FETCH_SIMILAR}${creatorId}/similar`;
      return HttpClient.get(url);
    },
    crmUpdate: (input) => HttpClient.post(API_ENDPOINTS.CRM_UPDATE, input),
  };

  crm = {
    update: (input) => HttpClient.post(API_ENDPOINTS.CRM_UPDATE, input),
    update_contacts: (input) => HttpClient.post(API_ENDPOINTS.CRM_UPDATE_CONTACTS, input),
    update_contact_status: (input) => HttpClient.post(API_ENDPOINTS.CRM_UPDATE_CONTACT_STATUS, input),
    creator_update_status: (input) => HttpClient.post(API_ENDPOINTS.CRM_CREATOR_UPDATE_STATUS, input),
    add: (input) => HttpClient.post(API_ENDPOINTS.CRM_ADD, input),
    creator_creators: () => HttpClient.get(API_ENDPOINTS.CRM_CREATOR_CREATORS),
    igdm_creators: () => HttpClient.get(API_ENDPOINTS.CRM_IGDM_CREATORS),
    contacts: () => HttpClient.get(API_ENDPOINTS.CRM_CONTACTS),
  };

  credx = {
    credits: (input) => HttpClient.get(API_ENDPOINTS.CREDX_CREDITS, input),
    subtract_credx: (input) => HttpClient.get(API_ENDPOINTS.SUBTRACT_CREDITS, input),

  };

  twilio = {
    sendCreatorSms: (input) => HttpClient.post(API_ENDPOINTS.TWILIO_SEND_CREATOR_SMS, input),
    fetch: () => HttpClient.get(API_ENDPOINTS.FETCH_MESSAGES),

  };

  creatorConnect = {
    campaigns: () => HttpClient.get(API_ENDPOINTS.creatorConnectCampaigns),
    editCreator: (input) => HttpClient.put(API_ENDPOINTS.CREATORCONNECT_EDIT, input),
    onboard: (input) => HttpClient.post(API_ENDPOINTS.CREATORCONNECT_ONBOARD, input),
    editCreatorStripe: (input) => HttpClient.put(API_ENDPOINTS.CREATORCONNECT_EDIT_STRIPE, input),
    getCreator: () => HttpClient.get(API_ENDPOINTS.CREATORCONNECT_GET),
    getEmails: (query) => HttpClient.get(API_ENDPOINTS.CREATORCONNECT_EMAILS, query),

  }

  invoices = {
    list: () => HttpClient.get(API_ENDPOINTS.INVOICES),
    listKPI: () => HttpClient.get(API_ENDPOINTS.INVOICE_KPI),

    delete: (input) => HttpClient.post(API_ENDPOINTS.DELETE_INVOICE, input),
    listAdmin: () => HttpClient.get(API_ENDPOINTS.INVOICES_ADMIN),
    editAdmin: (input) =>
      HttpClient.post(API_ENDPOINTS.EDIT_INVOICES_ADMIN, input),
    create: (input) => HttpClient.post(API_ENDPOINTS.CREATE_INVOICE, input),
    creatorList: () => HttpClient.get(API_ENDPOINTS.CREAOTR_INVOICES),

  };

  companies = {
    list: () => HttpClient.get(API_ENDPOINTS.COMPANY),
    create: (input) => HttpClient.post(API_ENDPOINTS.COMPANY, input),
    delete: (input) => HttpClient.post(API_ENDPOINTS.DELETE_COMPANY, input),
    edit: (input) =>
      HttpClient.post(
        `${API_ENDPOINTS.COMPANY}/${input.companyId}`,
        input.params
      ),
    listFetch: () => HttpClient.get(API_ENDPOINTS.FETCH_COMPANY_DATA),
    listUsers: () => HttpClient.get(API_ENDPOINTS.USERS_COMPANY),
    demoRegister: (input) => HttpClient.post(API_ENDPOINTS.DEMO_REGISTER, input),

  };

  conversations = {
    create: (input) => HttpClient.post(API_ENDPOINTS.CONVERSATIONS, input),
    check: (input) => HttpClient.post(API_ENDPOINTS.CONVERSATION_CHECK, input),
    sendMessage: (input) => HttpClient.post(API_ENDPOINTS.MESSAGES, input),
    getMessages: (conversationId) => HttpClient.get(`${API_ENDPOINTS.GET_CONVERSATION_MESSAGES}/${conversationId}`),
  };

  partnerships = {
    list: () => HttpClient.get(API_ENDPOINTS.PARTNERSHIPS),
    create: (input) => HttpClient.post(API_ENDPOINTS.PARTNERSHIPS, input),
    fetch: (id) => HttpClient.get(API_ENDPOINTS.PARTNERSHIPS_FETCH(id)),
    updateStatus: (id, input) => HttpClient.put(`${API_ENDPOINTS.UPDATE_PARTNERSHIP_STATUS}/${id}/status`, input),
    delete: (id) => HttpClient.delete(`${API_ENDPOINTS.DELETE_PARTNERSHIP}/${id}`),
    getAdminDetails: () => HttpClient.get(API_ENDPOINTS.ADMIN_PARTNERSHIPS),

  };

  partnershipConversations = {
    create: (input) => HttpClient.post(API_ENDPOINTS.PARTNERSHIP_CONVERSATIONS, input),
    check: (input) => HttpClient.post(API_ENDPOINTS.PARTNERSHIP_CONVERSATION_CHECK, input),
    sendMessage: (input) => HttpClient.post(API_ENDPOINTS.PARTNERSHIP_MESSAGES, input),
    getMessages: (conversationId) => HttpClient.get(`${API_ENDPOINTS.GET_PARTNERSHIP_CONVERSATION_MESSAGES}/${conversationId}`),
  };
  creatorPartnershipConversations = {
    create: (input) => HttpClient.post(API_ENDPOINTS.CREATOR_PARTNERSHIP_CONVERSATIONS, input),
    check: (input) => HttpClient.post(API_ENDPOINTS.CREATOR_PARTNERSHIP_CONVERSATION_CHECK, input),
    sendMessage: (input) => HttpClient.post(API_ENDPOINTS.CREATOR_PARTNERSHIP_MESSAGES, input),
    getMessages: (conversationId) => HttpClient.get(`${API_ENDPOINTS.GET_CREATOR_PARTNERSHIP_CONVERSATION_MESSAGES}/${conversationId}`),
  };

  commissions = {
    list: () => HttpClient.get(API_ENDPOINTS.COMMISSIONS),
    getAll: () => HttpClient.get(API_ENDPOINTS.COMMISSIONS_All),
  };

  deliverables = {
    list: () => HttpClient.get(API_ENDPOINTS.DELIVERABLES),
    create: (input) => HttpClient.post(API_ENDPOINTS.CREATE_DELIVERABLES, input),
    update: (id, input) => HttpClient.put(`${API_ENDPOINTS.UPDATE_DELIVERABLES}/${id}`, input), // Updated
    getByPartnership: (partnershipId) => HttpClient.get(`${API_ENDPOINTS.GET_DELIVERABLE_PARTNERSHIPS}/${partnershipId}`),
  };

  miscProjects = {
    list: () => HttpClient.get(API_ENDPOINTS.MISC_PROJECTS),
    create: (input) => HttpClient.post(API_ENDPOINTS.MISC_PROJECTS_CREATE, input),
    // fetch: (id) => HttpClient.get(API_ENDPOINTS.PARTNERSHIPS_FETCH(id)),
    // updateStatus: (id, input) => HttpClient.put(`${API_ENDPOINTS.UPDATE_PARTNERSHIP_STATUS}/${id}/status`, input),
    // delete: (id) => HttpClient.delete(`${API_ENDPOINTS.DELETE_PARTNERSHIP}/${id}`),
  };

}

export default new Client();
