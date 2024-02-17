## LinkedIn Ads ID Module for Prebid

#### Overview

LinkedIn Ads ID module is an extension for Prebid User ID module, aimed at incorporating LinkedIn 1P advertising identifiers into the Prebid ecosystem. This module enables the capture and utilization of LinkedIn's Ads ID (`li_adsId`) for better targeting, serving, and efficiency in advertising campaigns. The Prebid User ID module is a prerequisite for using LinkedIn Ads ID module.

For support and queries, reachout to prebid@linkedin.com.

#### Features

- Integrates with Prebid User ID module to support LinkedIn Ads ID.
- Utilizes browser cookies to retrieve LinkedIn Ads IDs.
- Implements GDPR, CCPA, and COPPA consent checks to comply with privacy regulations.
- Supports the generation of a new LinkedIn Ads ID if an existing one is not found, ensuring continuous tracking capabilities.
- Provides a mechanism to decode and prepare the LinkedIn Ads ID for bid requests.

#### Installation

To install LinkedIn Ads ID module, you must first ensure that Prebid User ID module is integrated into your Prebid setup. Once that prerequisite is met, you can include LinkedIn Ads ID module in your Prebid implementation.

1. Clone or download the Prebid.js repository
2. Navigate to the root directory of the cloned repository
3. Include LinkedIn Ads ID module in your build using the Prebid build tools.

#### Usage

To use LinkedIn Ads ID module, follow these steps:

1. Configure the User ID module in your Prebid setup
2. Add the LinkedIn Ads ID submodule configuration to the User ID module's configuration.

Example configuration:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "linkedInAdsId",
      storage: {
        type: "html5",
        name: "linkedInAdsId"
      }
    }],
    auctionDelay: 50 // Optional: set auction delay in milliseconds
  }
});
```

Class Methods
---

#### `getCookieIds()`
Returns the values of LinkedIn-specific cookies used for tracking (li_fat, li_giant) if set on page.

#### `decode(id)`
Decodes the stored LinkedIn Ads ID value for bid requests.

#### `getId(config)`
Retrieves the LinkedIn Ads ID from storage or generates a new one if necessary.

#### `hasConsent()`
Checks for the necessary consents (GDPR, CCPA, COPPA) before utilizing the LinkedIn Ads ID.

Prebid methods
---
#### pbjs.getUserIds()
```
{
  "linkedInAdsId": {
    "li_adsId": "358cd91a-462d-4363-88ca-0e9a956c9c46",
    "ext": {
      "li_fat": <string>,
      "li_giant": <string>
    }
  },
  ...
}
```

#### pbjs.getUserIdsAsEids()
```
[
  {
    "source": "linkedin.com",
    "uids": [
      {
        "id": "358cd91a-462d-4363-88ca-0e9a956c9c46", // linkedInAdsId value
        "atype": 1,
        "ext": {
          "li_fat": <string>,
          "li_giant": <string>
        }
      }
    ]
  }, ...
]
```
#### LocalStorage values example
```
{
  "li_adsId_cst": "zix7LPQsHA==",
  "li_adsId_exp": "Mon, 04 Mar 2024 20:30:05 GMT",
  "li_adsId": "358cd91a-462d-4363-88ca-0e9a956c9c46"
}
```

Consent Management
---
LinkedIn Ads ID module checks for GDPR, CCPA, and COPPA consents to ensure compliance with privacy regulations. It uses the Prebid consent management modules (gdprDataHandler, uspDataHandler, coppaDataHandler) to verify that the necessary consents are in place.


Contributing
---
Contributions to LinkedIn Ads ID module are welcome. Please follow the contributing guidelines outlined in the Prebid.js repository when submitting issues or pull requests.

License
---
LinkedIn Ads ID module is licensed under the same license as the Prebid.js project. Please refer to the Prebid.js repository for more details on the license.
