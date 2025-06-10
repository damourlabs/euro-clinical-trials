// Plugin to handle audit loggin for GDPR compliance

import type { AuditLogDetails, AuditLogEvent } from "~/models/audits";
import type { AuditActionType, AuditEntityTypeType } from "~/models/enums";


export const useAuditLogger = () => {

    const auditLogUrl = '/api/audit/log';

    const auditLog = async (action: AuditActionType, entityType: AuditEntityTypeType, auditLogDetails: AuditLogDetails) => {

        if (!action || !auditLogDetails) {
            console.error('Invalid audit log parameters:', { action, auditLogDetails });
            return;
        }
        // TODO: Implement more robust input validation

        const auditLogEvent: AuditLogEvent = {
            id: crypto.randomUUID(),
            action: action,
            entityType: entityType,
            details: auditLogDetails,
            timestamp: new Date()
        };


        try {
            await $fetch(auditLogUrl, {
                method: 'POST',
                body: auditLogEvent
            })
        } catch (error) {
            console.error('Audit log error:', error)
        }
    }


    return {
        auditLog
    }
}
