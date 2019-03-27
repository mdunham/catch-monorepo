function requiresIDV(kycNeeded, documents) {
  const hasUploadedId = documents && documents.some(d => d.type === 'PHOTOID');
  // we don't want to trigger id upload for users who solely have KYC_SSN OR KYC_OFAC
  const IDV_STATUSES = [
    'KYC_ID_FIELDS',
    'KYC_NAME',
    'KYC_MISMATCH',
    'KYC_ADDRESS',
  ];
  return (
    Array.isArray(kycNeeded) &&
    IDV_STATUSES.some(status => kycNeeded.includes(status)) &&
    !hasUploadedId
  );
}

export default requiresIDV;
