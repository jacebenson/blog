const site = require("./site");

module.exports = {
    overview: "I work on web technogies every day with ambition to learn more about what makes the web work. I love working on new/new to me libraries and all things Javascript.",
    location: "Robbinsdale, MN",
    socials: {
        twitter: "https://twitter.com/" + site.twitter,
        linkedin: "https://linkedin.com/in/jacebenson",
        "nowcommunity": "https://community.servicenow.com/community?id=community_user_profile&user=d6625a69dbd81fc09c9ffb651f9619fc",
        github: "https://github.com/jacebenson",
        website: site.baseURL
    },
    experience: [
        {
            company: "FICO",
            title: "ServiceNow Developer",
            location: "Roseville, MN",
            duration: "2016 - Present",
            summary: "",
            duties: [
                "Rewrote how server patching is evaluated from Servicenow",
                "Automated the CSR and KEY file generation for certificates",
                "Worked directly with end users to resolve support issues within ServiceNow",
                "Pointed, accepted, worked and released functionality in 2 week sprints",
                "Automated the request of thousands of server decoms using Jelly and later AngularJS",
                "Automated the access requests for Foreman with REST",
                "Upgraded the instance over multiple patches and versions (Helsinki->Jakarta)",
                "Implemented Service Portal"
            ]
        },
        {
            company: "Expedia",
            title: "Senior Engineer II",
            location: "Bellevue, WA",
            duration: "2014 - 2016",
            summary: "",
            duties: [
                "Played a key role in helping to define, document, and improve existing and new ServiceNow development processes with a goal of increasing quality while making the team more efficient",
                "Determined projects scope, functional requirements and a strategy that meets our customer's needs while satisfying scalability, reliability, performance, and resource constraints",
                "Provided extensive troubleshooting and technical expertise in identifying issues that impact service delivery",
                "Assisted in creating many integrations with many other teams using REST, SOAP, and custom processors in ServiceNow",
                "Was a major technical contributor to the re-launch of the Service Catalog",
                "Added integration to Puppet and SCCM to make our CMDB represent what Discovery couldn't get to",
                "Measured ServiceNow's performance after two unscheduled outages",
                "Created past metrics where possible to allow better insights into previous trends",
                "Implemented a Aggregate API which allowed other teams to get more data with less calls (before the official Aggregate API was released)",
                "Published three code bases on share.serivcenow.com. \"Automagically linking to records in journaled fields\", \"ServiceCatalog Custom Rest Processor\", and \"Slack Integration\""
            ]
        },
        {
            company: "Fruition Partners",
            title: "Senior Integration Consultant",
            location: "Minneapolis, MN",
            duration: "2014 - 2014",
            summary: "",
            duties: [
                "Developed integrations between the ServiceNow and various supporting software solutions. Participated in presales scoping meetings to properly scope the estimated level of effort for client's integrations",
                "Designed and develop integrations to meet the requirements of the client and ensure that the goals, objectives, and quality of project deliverables are met",
                "Accountable to the quality delivery of all assigned integration engagements",
                "Participated in presales scoping meetings to help the sales team properly scope the estimated level of effort for a potential client's integration",
                "Worked with clients to understand and meet their data conversion needs",
                "Was the onsite and primary integrations specialist for creating a fully automated end-to-end internal cloud offering leveraging the customers CHEF implentation, ServiceNow's Service Portfolio, and CMDB",
                "Worked to move some integrations from a previous solution to APIGEE as a middle technology with ServiceNow on the other side"
            ]
        },
        {
            company: "Fruition Partners",
            title: "Senior Technical Analyst",
            location: "Minneapolis, MN",
            duration: "2011 - 2014",
            summary: "",
            duties: [
                "Provided guidance on technical matters to both the client and internal resources alike, created a collaborative environment that maintained scope and met all the objectives set by the statements of work",
                "Worked with project sponsors and system administrators to customize ServiceNow to work for their organizations",
                "Researched, diagnosed, documented and resolved technical issues",
                "Enhanced incident, request, change, and survey management",
                "Implemented service portfolio management",
                "Imported knowledge from RightAnswers into ServiceNow",
                "Assisted with Orchestration configuration",
                "Created SOAP integration to oracle database to provision access",
                "Created a tool to import thousands of Microsoft documents with images intact in the knowledge application",
                "Managed Mediawiki installation",
                "Earned ITIL v3 Foundations and ServcieNow Administration certifications"
            ]
        },
    ],
    projects: [
        {
            title: "Blog",
            link: "https://jace.pro",
            role: "Creator",
            duration: "2015 - Present",
            summary: "A blog where I post anything I find helpful regarding ServiceNow and JamStack"
        },/*
        {
            title: "Treetop",
            link: "https://treetop.jace.pro",
            role: "Creator",
            duration: "2019 - 2019",
            summary: "A wooden computer case for a raspberry pi."
        },*/
        {
            title: "Jace-ty",
            link: "https://jace-ty.netlify.app",
            role: "Creator",
            duration: "2020 - Present",
            summary: "A 11ty starter I maintain that is used on jace.pro"
        },
        {
            title: "SNDocs",
            link: "https://sndocs.jace.pro",
            role: "Creator",
            duration: "2017 - Present",
            summary: "An unofficial ServiceNow version tracker"
        },
        {
            title: "ServiceNow presonal docs",
            link: "https://sn.jace.pro",
            role: "Creator",
            duration: "2017 - Present",
            summary: "Started as a place to track the undocumented things.  Changed to hold any technical docs I find useful"
        },
        {
            title: "news.jace.pro",
            link: "https://news.jace.pro",
            role: "Creator",
            duration: "2019 - Present",
            summary: "A ServiceNow News Aggregator"
        },
        {
            title: "NowComponents",
            link: "https://nowcomponents.github.io",
            role: "Maintainer",
            duration: "2020 - 2020",
            summary: "Hacktoberfest 2020 Project to learn ServiceNow Now Components on Seismic"
        },/*
        {
            title: "Cajunbot",
            link: "https://github.com/jacebenson/cajunbot",
            role: "Creator",
            duration: "2018 - Present",
            summary: "A Discord bot I run on some servers"
        },
        {
            title: "Joke Site",
            link: "https://joke.jace.pro",
            role: "Creator",
            duration: "2016 - Present",
            summary: "A simple Joke site"
        }*/
    ],
    skills: [
        { title: "Languages", summary: "HTML, CSS, SCSS, JavaScript, XML, Jelly, PHP, and SQL"},
        { title: "Libraries", summary: "jQuery, Angular, Prototype, Node.js, React, Redwoodjs, and 11ty"},
        { title: "Platforms", summary: "ServiceNow, Mediawiki, Node-red, Docker, and Wordpress"},
        { title: "Web Services", summary: "REST, SOAP, and GraphQL"}
    ],
    awards: [
        { title: "2020 ServiceNow Developer MVP", link: "https://developer.servicenow.com/blog.do?p=/post/all-stars/", organization: "ServiceNow", duration: "2020"},
        { title: "2020 ServiceNow Community MVP", link: "https://community.servicenow.com/community?id=community_blog&sys_id=fb488720dbaacc504819fb2439961900", organization: "ServiceNow", duration: "2020"} ,
        { title: "2021 ServiceNow Developer MVP", link: "https://developer.servicenow.com/blog.do?p=/post/2021-developer-mvp-announcement/", organization: "ServiceNow", duration: "2021"},
        { title: "2021 ServiceNow Community MVP", link: "https://community.servicenow.com/community?id=community_blog&sys_id=ebc85e18db42ec10b1b102d5ca96193e", organization: "ServiceNow", duration: "2021"}

    ],
    associations: [
        { title: "ServiceNow Minneapolis Meetup", link: "https://www.meetup.com/Minneapolis-ServiceNow-Developer-Meetup/", organization: "ServiceNow", role: "Organizer", duration: "2016 - Present"}
    ]
};