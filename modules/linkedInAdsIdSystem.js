/**
 * This module adds LinkedIn Audience Network ID to the User ID module
 * The {@link module:modules/userId} module is required
 * @module modules/linkedInAudienceNetworkIdSystem
 * @requires module:modules/userId
 */

import { logInfo, generateUUID } from '../src/utils.js';
import { submodule } from '../src/hook.js';
import { getStorageManager } from '../src/storageManager.js';
import { MODULE_TYPE_UID } from '../src/activities/modules.js';
import { uspDataHandler, coppaDataHandler, gdprDataHandler } from '../src/adapterManager.js';

const MODULE_NAME = 'linkedInAudienceNetworkId';
const STORAGE_KEY = 'li_adsId';
const LOG_PREFIX = 'LinkedIn Audience Network Id: ';
const LI_FAT_COOKIE = 'li_fat';
const LI_GIANT_COOKIE = 'li_giant';

const BrowserStorage = getStorageManager({ moduleType: MODULE_TYPE_UID, moduleName: MODULE_NAME });

/** @type {Submodule} */
export const linkedInAudienceNetworkIdSubmodule = {

  /**
   * Used to link submodule with config
   * @type {string}
   */
  name: MODULE_NAME,

  /**
   * @returns { li_fat: <string>, li_giant: <string> }
   */
  getCookieIds() {
    return {
      'li_fat': BrowserStorage.getCookie(LI_FAT_COOKIE),
      'li_giant': BrowserStorage.getCookie(LI_GIANT_COOKIE),
    };
  },

  /**
   * Decode stored value for bid requests
   * @param {Object} liObj
   * @returns {Object}
   */
  decode(id) {
    const cookies = this.getCookieIds();
    logInfo(`${LOG_PREFIX} found Legacy cookies: ${JSON.stringify(cookies)}`);

    const linkedInAudienceNetworkId = {
      li_adsId: id,
      ext: {
        ...cookies,
      },
    };

    return { linkedInAudienceNetworkId };
  },

  /**
   * Performs actions to obtain `linkedInAudienceNetworkId` from storage
   * @returns { { id: string } | undefined }
   */
  getId(config) {
    const localKey = config?.storage?.name || STORAGE_KEY;
    let id = BrowserStorage.localStorageIsEnabled() && BrowserStorage.getDataFromLocalStorage(localKey);

    if (this.hasConsent() && !id) {
      logInfo(`${LOG_PREFIX} existing id not found, generating a new li_adsId`);
      id = generateUUID();
    }

    return { id };
  },

  /**
   * Check all consent types, GDPR, CCPA, including processing TCF v2 consent string
   * @param {Object} consentData - Prebid consent data
   * @returns {boolean}
   */
  hasConsent: function() {
    /**
     * GDPR check
     * Negative of (consentData.gdprApplies === true || consentData.gdprApplies === 1)
     */
    const gdprConsentData = gdprDataHandler.getConsentData();
    const hasGDPRConsent = !(gdprConsentData?.gdprApplies);

    /**
     * COPPA - Parental consent for the collection and use of personal data for users under the age of 13,
     * as required by the COPPA regulation in the United States.
     */
    const isCoppaApplicable = coppaDataHandler.getCoppa();

    /**
     * CCPA Consent String processing
     * https://github.com/InteractiveAdvertisingBureau/USPrivacy/blob/master/CCPA/US%20Privacy%20String.md
     */
    const usPrivacyString = uspDataHandler.getConsentData();
    const hasCCPAConsent = !(
      usPrivacyString.length === 4 &&
      usPrivacyString[1] === 'Y' && // Publisher has provided notice
      usPrivacyString[2] === 'Y' // user has made a choice to opt out of sale
    );

    return hasGDPRConsent && hasCCPAConsent && !isCoppaApplicable;
  },

  eids: {
    'linkedInAudienceNetworkId': {
      source: 'linkedin.com',
      getValue: function(data) {
        return data.li_adsId;
      },
      getUidExt: function(data) {
        if (data.ext) {
          return data.ext;
        }
      },
      atype: 1,
    },
  }
};

submodule('userId', linkedInAudienceNetworkIdSubmodule);