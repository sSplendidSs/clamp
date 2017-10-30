.. This work is licensed under a Creative Commons Attribution 4.0 International License.
.. http://creativecommons.org/licenses/by/4.0
.. Copyright 2017 AT&T Intellectual Property.  All rights reserved.


Clamp in ONAP Architecture
--------------------------

CLAMP is a platform for designing and managing control loops. It is used to design
a closed loop, configure it with specific parameters for a particular network
service, then deploying and undeploying it.  Once deployed, the user can also
update the loop with new parameters during runtime, as well as suspending and
restarting it.

It interacts with other systems to deploy and execute the closed loop. For
example, it pushes the control loop design to the SDC catalog, associating it
with the VF resource.  It requests from DCAE the instantiation of microservices
to manage the closed loop flow.  Further, it creates and updates multiple
policies in the Policy Engine that define the closed loop flow.

The ONAP CLAMP platform abstracts the details of these systems under the concept
of a control loop model.  The design of a control loop and its management is
represented by a workflow in which all relevant system interactions take
place.  This is essential for a self-service model of creating and managing
control loops, where no low-level user interaction with other components is
required.

At a higher level, CLAMP is about supporting and managing the broad operational
life cycle of VNFs/VMs and ultimately ONAP components itself. It will offer the
ability to design, test, deploy and update control loop automation - both closed
and open. Automating these functions would represent a significant saving on
operational costs compared to traditional methods.