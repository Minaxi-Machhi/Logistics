POC Brief — Wared Logistic Platform
Type: Proof of Concept — for client demo

1. Background
Wared is a distribution and logistics company running dry and chilled delivery across the UAE. They manage customer orders, plan delivery trips, and operate a fleet of vehicles and drivers. They also do freight forwarding, and domestic/cross-border transport.

This platform will connect customers, operations, and third-party vendors (subcontractors) in a unified ecosystem focusing on FTL (Full Truckload) and LTL (Less than Truckload) logistics.

2. Objective
Deliver a proof-of-concept distribution / transport management platform that shows, in one connected system, how Wared would manage the full delivery lifecycle — from order intake through trip planning, live tracking, delivery, and invoicing — along with a customer-facing portal for order placement and visibility.

This POC is intended for a demo to client stakeholders. It is not a production deployment.

3. Users
Role	Description
Operations Admin	Wared Logistics internal staff managing day-to-day distribution operations
Customer	Wared Logistics' clients placing and tracking their orders
A shared demo login can be used per role.

4. Functional scope
The POC should cover the following areas:

Dashboard — operational overview: order volumes, active / completed / failed deliveries, fleet and driver utilisation, key charts, and date / branch filters.
Orders — view and create FTL (Full Truckload) and LTL (Less than Truckload) orders. Order detail view with items, delivery addresses, and status.
Trip Planning — group orders into delivery trips, assign a driver and vehicle, and schedule them. Trip list and trip detail.
Control Tower / Live Tracking — map-based view of trips and vehicles with delivery status, plus a summary of trips, orders, and assets.
Customer Portal — customers place orders, track their shipments, and view invoices.
Invoicing — generate and view invoices with status (e.g. draft, sent, paid).
Assets — basic driver and vehicle records to support trip planning.
5. Demo scenario
A representative end-to-end journey to walk stakeholders through:

As Operations Admin: 1. View the dashboard (orders, deliveries, fleet utilisation). 2. Create a new multi-drop order (e.g. 3 delivery stops). 3. Plan a trip — assign a driver and vehicle. 4. Track the trip on the control tower map. 5. Mark the trip delivered and generate an invoice.

As Customer: 6. Log in to the portal, place an order, track it, and view the invoice.

6. In scope / out of scope
In scope: the screens and the end-to-end journey above, using representative sample data.

Out of scope (this phase): - Real integrations (ERP, accounting, GPS hardware, payment gateways) - Production-grade authentication and permissions - Mobile applications - Advanced reporting, freight audit, and billing automation

7. Notes & assumptions
This is a demo POC for stakeholder presentation — representative sample data is acceptable, and live integrations are not required at this stage.
Visual design and branding should align with Wared Logistics' identity (logo and colours per their website).
8. Success criteria
Stakeholders can follow the full delivery journey in a live click-through, with no dead ends.
The screens feel like one coherent product, not separate prototypes.
Likely client questions — multi-drop orders, live tracking, invoicing — can be answered by clicking through rather than explaining.