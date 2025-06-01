export const AppConstant = {
  Config: {
    BASE_API_URL: 'https://datashop.farookcircle.com',
    STAGING_API_URL: 'https://datashop-staging.farookcircle.com',
    LOCAL_API_URL: 'http://127.0.0.1:8000',
    REMOTE_API_URL: 'http://192.168.1.190:8000',
  },
  STORAGE_KEYS: {
    NOTIFICATION_KEY: 'notificationKey',
    USER_SESSION: 'user_session',
    TICKET_LIST_VIEW: 'ticket_list_view',
  },

  VALIDATION_REGEX: {
    NUMBER: /^[0-9]*$/,
    NIN: /^[0-9]{11}$/,
    EMAIL:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    BVN: /^[0-9]{11}$/,
    PASSWORD_PARTS: {
      NUMBER: /[0-9]/g,
      LOWERCASE: /[a-z]/g,
      UPPERCASE: /[A-Z]/g,
      SPECIAL_CHAR: /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
      MIN_MAX: /^.{8,20}$/,
    },
    PHONE: /^[0-9]{10,11}$/,
    PASSWORD_REGEX:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]).{8,20}$/,
  },
};
