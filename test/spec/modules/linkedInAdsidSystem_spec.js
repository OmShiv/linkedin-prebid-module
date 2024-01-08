import {
  linkedInAudienceNetworkIdSubmodule,
  BrowserStorage,
  LI_FAT_COOKIE,
  LI_GIANT_COOKIE
} from 'modules/linkedInAdsIdSystem.js';
import { uspDataHandler, coppaDataHandler, gdprDataHandler } from '../src/adapterManager.js';

describe('LinkedIn Audience Network ID module', () => {
  const dummyLiFat = '12345abc';
  const dummyLiGiant = '67890xyz';

  let storageStub;

  beforeEach(() => {
    storageStub = sinon.stub(BrowserStorage, 'getCookie');
  });

  afterEach(() => {
    storageStub.restore();
    gdprStub.restore();
    ccpaStub.restore();
    coppaStub.restore();
  });

  describe('getCookieIds', () => {
    it('should return li_fat and li_giant cookies', () => {
      storageStub.withArgs(LI_FAT_COOKIE).returns(dummyLiFat);
      storageStub.withArgs(LI_GIANT_COOKIE).returns(dummyLiGiant);

      const cookies = linkedInAudienceNetworkIdSubmodule.getCookieIds();

      expect(cookies.li_fat).to.equal(dummyLiFat);
      expect(cookies.li_giant).to.equal(dummyLiGiant);
    });
  });

  describe('decode', () => {
    it('should return linkedInAudienceNetworkId and legacy cookies if available', () => {
      const id = '12345abcde';
      const decoded = linkedInAudienceNetworkIdSubmodule.decode(id);

      expect(decoded).to.deep.equal({
        linkedInAudienceNetworkId: id,
        ext: {
          li_fat: dummyLiFat,
          li_giant: dummyLiGiant
        }
      });
    });
  });

  describe('getId', () => {
    it('should generate and save a new ID', () => {
      const genUuidStub = sinon.stub().returns('dummyId123');
      linkedInAudienceNetworkIdSubmodule.generateUUID = genUuidStub;

      linkedInAudienceNetworkIdSubmodule.hasConsent = () => true;

      const id = linkedInAudienceNetworkIdSubmodule.getId();

      expect(id).to.deep.equal({
        id: 'dummyId123'
      });

      expect(genUuidStub.calledOnce).to.be.true;
    });
  });

  describe('Consent checks `hasConsent`', () => {
    let gdprStub, ccpaStub, coppaStub;

    beforeEach(() => {
      gdprStub = sinon.stub(gdprDataHandler, 'getConsentData');
      ccpaStub = sinon.stub(uspDataHandler, 'getConsentData');
      coppaStub = sinon.stub(coppaDataHandler, 'getCoppa');
    });

    afterEach(() => {
      gdprStub.restore();
      ccpaStub.restore();
      coppaStub.restore();
    });

    it('should return true if all consents present', () => {
      gdprStub.returns({gdprApplies: false});
      ccpaStub.returns('1YYN');
      coppaStub.returns(false);

      expect(linkedInAudienceNetworkIdSubmodule.hasConsent()).to.be.true;
    });

    it('should return false if GDPR consent missing', () => {
      gdprStub.returns({gdprApplies: true});

      expect(linkedInAudienceNetworkIdSubmodule.hasConsent()).to.be.false;
    });

    it('should return false if CCPA opt-out', () => {
      ccpaStub.returns('1YNN');

      expect(linkedInAudienceNetworkIdSubmodule.hasConsent()).to.be.false;
    });

    it('should return false if COPPA applicable', () => {
      coppaStub.returns(true);

      expect(linkedInAudienceNetworkIdSubmodule.hasConsent()).to.be.false;
    });
  });
});
