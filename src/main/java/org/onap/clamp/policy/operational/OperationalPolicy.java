/*-
 * ============LICENSE_START=======================================================
 * ONAP CLAMP
 * ================================================================================
 * Copyright (C) 2019 AT&T Intellectual Property. All rights
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
 *
 */

package org.onap.clamp.policy.operational;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.annotations.Expose;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.onap.clamp.dao.model.jsontype.StringJsonUserType;
import org.onap.clamp.loop.Loop;
import org.onap.clamp.policy.Policy;
import org.yaml.snakeyaml.Yaml;

@Entity
@Table(name = "operational_policies")
@TypeDefs({ @TypeDef(name = "json", typeClass = StringJsonUserType.class) })
public class OperationalPolicy implements Serializable, Policy {
    /**
     * The serial version ID.
     */
    private static final long serialVersionUID = 6117076450841538255L;

    @Id
    @Expose
    @Column(nullable = false, name = "name", unique = true)
    private String name;

    @Expose
    @Type(type = "json")
    @Column(columnDefinition = "json", name = "configurations_json")
    private JsonObject configurationsJson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loop_id", nullable = false)
    private Loop loop;

    public OperationalPolicy() {
        // Serialization
    }

    /**
     * The constructor.
     *
     * @param name
     *        The name of the operational policy
     * @param loop
     *        The loop that uses this operational policy
     * @param configurationsJson
     *        The operational policy property in the format of json
     */
    public OperationalPolicy(String name, Loop loop, JsonObject configurationsJson) {
        this.name = name;
        this.loop = loop;
        this.configurationsJson = configurationsJson;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setLoop(Loop loopName) {
        this.loop = loopName;
    }

    public Loop getLoop() {
        return loop;
    }

    @Override
    public JsonObject getJsonRepresentation() {
        return configurationsJson;
    }

    public JsonObject getConfigurationsJson() {
        return configurationsJson;
    }

    public void setConfigurationsJson(JsonObject configurationsJson) {
        this.configurationsJson = configurationsJson;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        OperationalPolicy other = (OperationalPolicy) obj;
        if (name == null) {
            if (other.name != null) {
                return false;
            }
        } else if (!name.equals(other.name)) {
            return false;
        }
        return true;
    }

    @Override
    public String createPolicyPayload() {
        JsonObject policyPayloadResult = new JsonObject();

        policyPayloadResult.addProperty("tosca_definitions_version", "tosca_simple_yaml_1_0_0");

        JsonObject topologyTemplateNode = new JsonObject();
        policyPayloadResult.add("topology_template", topologyTemplateNode);

        JsonArray policiesArray = new JsonArray();
        topologyTemplateNode.add("policies", policiesArray);

        JsonObject operationalPolicy = new JsonObject();
        policiesArray.add(operationalPolicy);

        JsonObject operationalPolicyDetails = new JsonObject();
        operationalPolicy.add(this.name, operationalPolicyDetails);
        operationalPolicyDetails.addProperty("type", "onap.policies.controlloop.Operational");
        operationalPolicyDetails.addProperty("version", "1.0.0");

        JsonObject metadata = new JsonObject();
        operationalPolicyDetails.add("metadata", metadata);
        metadata.addProperty("policy-id", this.name);

        operationalPolicyDetails.add("properties", this.configurationsJson.get("operational_policy"));

        Gson gson = new GsonBuilder().create();
        Map<?, ?> jsonMap = gson.fromJson(gson.toJson(policyPayloadResult), Map.class);
        return (new Yaml()).dump(jsonMap);
    }

    /**
     * Return a map containing all Guard policies indexed by Guard policy Name.
     *
     * @return The Guards map
     */
    public Map<String, String> createGuardPolicyPayloads() {
        Map<String, String> result = new HashMap<>();

        JsonElement guardsList = this.getConfigurationsJson().get("guard_policies");
        if (guardsList != null) {
            for (Entry<String, JsonElement> guardElem : guardsList.getAsJsonObject().entrySet()) {
                JsonObject guard = new JsonObject();
                guard.addProperty("policy-id", guardElem.getKey());
                guard.add("contents", guardElem.getValue());
                result.put(guardElem.getKey(), new GsonBuilder().create().toJson(guard));
            }
        }
        return result;
    }

}
