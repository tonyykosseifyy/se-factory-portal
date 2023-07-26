const DATBASE_TECHNOLOGIES = [
  { category: 'Relational databases', name: 'MySQL' },
  { category: 'Relational databases', name: 'PostgreSQL' },
  { category: 'Relational databases', name: 'Oracle' },
  { category: 'NoSQL databases', name: 'MongoDB' },
  { category: 'NoSQL databases', name: 'Cassandra' },
  { category: 'NoSQL databases', name: 'Redis' },
];

const CLOUD_PLATFORMS = [
  "Amazon Web Services (AWS)",
  "Google Cloud Platform (GCP)",
  "Microsoft Azure"
];

const DATA_VISUALIZATION_TOOLS = [
  "Tableau",
  "Power BI",
  "QlikView",
  "Looker",
  "Google Data Studio"
];

const FSD_FILTERS = {
  "Database Technologies": DATBASE_TECHNOLOGIES,
  "Cloud Platforms": CLOUD_PLATFORMS,
  "Data Visualization": DATA_VISUALIZATION_TOOLS
};

export default FSD_FILTERS;