/*-
 * ============LICENSE_START=======================================================
 * ONAP CLAMP
 * ================================================================================
 * Copyright (C) 2017-2018 AT&T Intellectual Property. All rights
 *                             reserved.
 * ================================================================================
 * Modifications Copyright (c) 2019 Samsung
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
 *
 */

package org.onap.clamp.clds.model.properties;

import com.att.eelf.configuration.EELFLogger;
import com.att.eelf.configuration.EELFManager;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * Provide base ModelElement functionality. Perform base parsing of properties for a ModelElement (such as,
 * VesCollector, Policy, Tca, Holmes, ...)
 */
public abstract class AbstractModelElement {

    protected static final EELFLogger logger = EELFManager.getInstance().getLogger(AbstractModelElement.class);
    protected static final EELFLogger auditLogger = EELFManager.getInstance().getAuditLogger();
    private final String id;
    protected String topicPublishes;
    protected final JsonElement modelElementJsonNode;
    private final boolean isFound;

    /**
     * Perform base parsing of properties for a ModelElement (such as, VesCollector, Policy and Tca).
     */
    protected AbstractModelElement(String type, ModelBpmn modelBpmn, JsonObject modelJson) {
        this.id = modelBpmn.getId(type);
        this.modelElementJsonNode = modelJson.get(id);
        this.isFound = modelBpmn.isModelElementTypeInList(type);
    }

    /**
     * Get the topic publishes.
     *
     * @return the topicPublishes
     */
    public String getTopicPublishes() {
        return topicPublishes;
    }

    /**
     * Get the id.
     *
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * Get the isFound flag.
     *
     * @return the isFound
     */
    public boolean isFound() {
        return isFound;
    }
}
