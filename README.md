# LinkedIn Ads ID Module for Prebid

## Overview

The LinkedIn Ads ID module is an extension for the Prebid User ID module, aimed at incorporating LinkedIn advertising identifiers into the Prebid ecosystem. This module enables the capture and utilization of LinkedIn's Ads ID for better targeting and efficiency in advertising campaigns. The Prebid User ID module is a prerequisite for using the LinkedIn Ads ID module.

For support and queries, reachout to prebid@linkedin.com.

## Features

- Integrates with the Prebid User ID module to support LinkedIn Ads ID.
- Utilizes browser cookies to retrieve LinkedIn Ads IDs.
- Implements GDPR, CCPA, and COPPA consent checks to comply with privacy regulations.
- Supports the generation of a new LinkedIn Ads ID if an existing one is not found, ensuring continuous tracking capabilities.
- Provides a mechanism to decode and prepare the LinkedIn Ads ID for bid requests.

## Installation

To install the LinkedIn Ads ID module, you must first ensure that the Prebid User ID module is integrated into your Prebid setup. Once that prerequisite is met, you can include the LinkedIn Ads ID module in your Prebid implementation.

1. Clone or download the Prebid.js repository.
2. Navigate to the root directory of the cloned repository.
3. Include the LinkedIn Ads ID module in your build using the Prebid build tools.

## Usage

To use the LinkedIn Ads ID module, follow these steps:

1. Configure the User ID module in your Prebid setup.
2. Add the LinkedIn Ads ID submodule configuration to the User ID module's configuration.
3. Ensure that your site has the necessary cookies (`li_fat`, `li_giant`) set by LinkedIn for tracking.

Example configuration:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: "linkedInAdsId",
      storage: {
        name: "li_adsId",
        type: "cookie",
        expires: 60
      }
    }],
    auctionDelay: 50 // Optional: set auction delay in milliseconds
  }
});

Methods
---

## `getCookieIds()`
Returns the values of LinkedIn-specific cookies used for tracking (li_fat, li_giant).

## `decode(id)`
Decodes the stored LinkedIn Ads ID value for bid requests.

## `getId(config)`
Retrieves the LinkedIn Ads ID from storage or generates a new one if necessary.

## `hasConsent()`
Checks for the necessary consents (GDPR, CCPA, COPPA) before utilizing the LinkedIn Ads ID.

## Consent Management
The LinkedIn Ads ID module checks for GDPR, CCPA, and COPPA consents to ensure compliance with privacy regulations. It uses the Prebid consent management modules (gdprDataHandler, uspDataHandler, coppaDataHandler) to verify that the necessary consents are in place.

## Contributing
Contributions to the LinkedIn Ads ID module are welcome. Please follow the contributing guidelines outlined in the Prebid.js repository when submitting issues or pull requests.

## License
The LinkedIn Ads ID module is licensed under the same license as the Prebid.js project. Please refer to the Prebid.js repository for more details on the license.
