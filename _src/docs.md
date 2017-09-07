---
layout: page

title: Documentation
subtitle: Sharing the knowledge

narrow: true
---

Under [developers.ipdb.io](https://developers.ipdb.io) you can find the portal for developers who want to access IPDB. Right now, we are inviting users to participate in the IPDB Test Network. If you aren’t already in, you can sign up for early access to the IPDB Test Network. We plan to open the IPDB Production Network to everyone later this year.

## Getting Started

Anyone—a person or organization—can sign up for an IPDB Developer Portal account as a developer. By signing up, you agree to the IPDB Test Network [Terms of Service](/terms/) and [Privacy Policy](/privacy/).

New accounts must be approved by the IPDB Support Team. Every developer will get one application (or app) to start with.

If approved, a developer can create more applications (details below). If a developer is denied or rejected, their account and initial application will be deleted.

## Application ID and Keys

Every application has an application ID (`app_id`) and one or more application keys (`app_key`). The app id and keys are also called API credentials. Each application can make HTTP requests using its credentials and the BigchainDB HTTP API (explained below). An application should only use its own credentials, never the credentials of other applications.

Application IDs and application keys should be kept secret.

If you, as a developer, want to allow users to send HTTP requests directly to the IPDB Test Network or Production Network, you must first get explicit prior consent from the IPDB Foundation. Only then are you, as a developer, allowed to share app ids and app keys with your users.

## How to Make HTTP Requests

The IPDB Test Network is an instance of a BigchainDB cluster. The API is the [BigchainDB HTTP API](https://docs.bigchaindb.com/projects/server/en/latest/drivers-clients/http-client-server-api.html). Sign in and visit the home page for specific instructions about how to send requests to the IPDB Test Network.

### Limits

- Each of your applications has its own limits. Those limits are determined by the plan that the application is using. Application plan limits are outlined in the Billing section below.
- Maximum of 500,000 API calls per day, summed over all applications. This is a limit of our current 3scale plan.
- Maximum of 600 API calls per minute, summed over all applications. This is a limit of our current 3scale plan.
- Maximum HTTP request body size (e.g. transaction size) of 15kB (15 kilobytes = 15000 bytes). (We use the NGINX setting `client_max_body_size 15k;` to enforce this.)
- NGINX is set to process a maximum of 10 requests per second sustained, per IP address. It can hold up to 10 more requests (per IP address) in its buffer, to accomodate short bursts above 10 requests per second.

## How to Create a New Application

There are two ways for a developer to create a new application.

1. One way is to sign in on the developer portal, click APPLICATIONS in the top menu, and then click the button labelled "Create new application".

2. A second way is to make an HTTP request to the IPDB-Agent, an online microservice that can create new applications on behalf of IPDB. If you'd like to do this, please contact us using the IPDB Foundation's [contact page](/contact/).

## Billing

A developer can have several applications. Each application has a plan associated with it.

Right now, the IPDB Test Network only has one plan: a free plan, but it has a limit. We keep track of the total data transferred IN by each application, and that is capped at 100 MB per month. We may change that cap in the future, and we may offer additional plans in the future, including paid ones.

The IPDB Production Network is not currently available, but we intend to offer the following plans once it is available:

1. Free: 10 MB data transfer (IN) per month (about 10k transactions`*`)

2. $20 per month: 200 MB data transfer (IN) per month (about 200k transactions*)

3. $50 per month: 500 MB data transfer (IN) per month (about 500k transactions*)

4. $100 per month: 1000 MB data transfer (IN) per month (about 1M transactions*)

`*`assuming an average transaction size of 1 kb (typical).

When an application goes over 80% of its data transfer allowance, an email alert is sent to the developer. Same for 90% and 100%. If an application goes over its data transfer allowance (i.e. over 100%), then subsequent API requests from that application will be dropped.

A developer can change an application's billing plan mid-month (e.g. to get more data transfer allowance).

All application data transfer allowances reset at the beginning of each month. If an application doesn't use up its data transfer allowance for a month, then the remaining data transfer is not rolled over into the next month.

The first invoice is sent to the developer 3–4 days after they sign up for a plan (pro-rated, meaning they are only invoiced for the part of the month that they had the plan). All subsequent invoices are sent near the beginning of each month, typically the fourth day of the month. Two days after an invoice is issued, it becomes due and the associated credit card will be charged (if applicable).

## How to Change an Application's Plan

If you want to change an application's plan, then login to the IPDB Developer Portal, go to Applications, click on the name of the application, and then click the "REVIEW/CHANGE" button beside the name of the plan. Note: The Test Network API has only one plan, so you can't change to a different one. Also, at the time of writing, the Production Network had only one available plan.

You can't change an application from a Test Network API plan to a Production Network API plan or vice versa.

## How to Delete an Application

If you want to delete an application, please email your request to support@ipdb.io.

## How to Delete Your Developer Account

If you want to delete your developer account, please email your request to [support@ipdb.io](mailto:support@ipdb.io).

## Contact Us

Anyone can contact us using the IPDB Foundation's [contact page](/contact/).
