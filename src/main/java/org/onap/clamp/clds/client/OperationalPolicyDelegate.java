/*-
 * ============LICENSE_START=======================================================
 * ONAP CLAMP
 * ================================================================================
 * Copyright (C) 2017 AT&T Intellectual Property. All rights
 *                             reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License.
 * ============LICENSE_END============================================
 * ===================================================================
 * ECOMP is a trademark and service mark of AT&T Intellectual Property.
 */

package org.onap.clamp.clds.client;

import org.onap.clamp.clds.client.req.OperationalPolicyReq;
import org.onap.clamp.clds.model.prop.ModelProperties;
import org.onap.clamp.clds.model.refprop.RefProp;
import org.openecomp.policy.api.AttributeType;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;


/**
 * Send Operational Policy info to policy api.
 */
public class OperationalPolicyDelegate implements JavaDelegate {
    // currently uses the java.util.logging.Logger like the Camunda engine
    private static final Logger logger = Logger.getLogger(OperationalPolicyDelegate.class.getName());

    @Autowired 
    private PolicyClient policyClient;
    
    @Autowired
    private RefProp refProp;

    /**
     * Perform activity.  Send Operational Policy info to policy api.
     *
     * @param execution
     */
    public void execute(DelegateExecution execution) throws Exception {
        String operationalPolicyRequestUuid = UUID.randomUUID().toString();
        execution.setVariable("operationalPolicyRequestUuid", operationalPolicyRequestUuid);

        ModelProperties prop = ModelProperties.create(execution);
        Map<AttributeType, Map<String, String>> attributes = OperationalPolicyReq.formatAttributes(refProp, prop);
        String responseMessage = policyClient.sendBrms(attributes, prop, operationalPolicyRequestUuid);
        if (responseMessage != null) {
            execution.setVariable("operationalPolicyResponseMessage", responseMessage.getBytes());
        }
    }

}
