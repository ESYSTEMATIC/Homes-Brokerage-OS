// Contracts module retired on 08-May per stakeholder review.
// Contract lifecycle is now tracked directly on the Deal:
//   • Off Plan: "Contract Signed" stage locks commission; "Standard Collection
//     (10%)" stage marks revenue recognised.
//   • Resale:   "Contract Signed & Payment" stage locks commission AND marks
//     revenue recognised in the same step.
//
// This file is kept as a no-op stub because some legacy imports may still
// reference it. The route /system/crm/contracts is redirected to
// /system/crm/deals in App.jsx, so this component should never actually render.
export const CrmContracts = () => null;
