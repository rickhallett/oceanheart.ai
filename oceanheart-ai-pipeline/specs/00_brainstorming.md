# High level breakdown
- A tool that utilises an existing gpt-researcher tool and enhances it with a looping workflow of n length, ultimately turning an individual query into a hyper linked wiki of research with citations for verification.
- The gpt-researcher takes a query, searches the web, and produces a report with citations.
- The new software will initiate gpt-researcher, and collect its results. It will use the report (via LLM), to generate a series of subquestions based on the initial query. Different types of subquestions can be asked for via a selection of prompts, chosen at the time of the initial query.
- These prompts will be designed to summarise, distill, reflect on, aggregate etc - a number of information functions useful in producing large bodies of interconnected knowledge. Which prompt is selected at which point remains to be determined; it could be algorithmic, AI agentic, or a combination of both.
- The generated subquestions are queued for processing. The gpt-researcher tool is actually called as part of an asynchronous event based pipeline, with each query sent as an event to an api. This is queued up by celery as a task and it is then responsible for passing each query into the pipeline.
- The pipeline initially passes off the query to gpt-researcher and awaits the report. On receipt, the report is sent back to the calling api, and it also passes the report down the pipeline to other nodes responsible for passing that report to LLMs with the information function prompts. It would even be possible at that point to use a series of nodes to execute in parallel, each with their own prompt, so that all prompts are handled all the time for maximum knowledge permutation.
- Every LLM response will have generated one or more further questions to ask. These are sent back to the calling api into a queue which will in turn send back as further events to the pipeline api. This will need to be rate limited to avoid exponentially larger requests of LLM compute time, but that rate can be set on a gradient to allow for the massive recruitment of parallel processing and report generation if required, for a set period of time, or perhaps token use / api cost depending how it is designed. Eventually, perhaps all three.
- As a seperately running process, the initiating api (that is recieving reports and subquestions), will be submitting collections of reports and their citations to the LLM pipeline, but under a different event type. This type will be responsible for initiating a seperate pipeline that takes reports and through one or more steps creates a series of interconnected markdown documents in the form of a wiki. Context length will need to be managed effectively here, but LLM endpoints with large context windows can also be used specifically for this purpose. The markdown documents are eventually sent back to the initiating api for collection under the initiating query, which serves as the 'root node', essentially. It may be possible to use graph structures for the linking of these documents, but I do not know much about this at all and for the sake of speed would probably need to abstract this away to a service, if one exists.
- A seperately running process, on completion of each root node (by time limit, request limit, cost limit etc), will send off the documents to be indexed by a vector database. The pipeline api has existing functionality to chunk and index documentation. I might use this, or I might delegate it to a specialist api, if doing it manually proves too time intensive, or two steep a learning curve. I want to ship an early version of this product as quickly as reasonably possible and get user feedback before going mad on features.
- This RAG database can then be queried by natural language for someone to be able to interact with the produced knowledge, as well as having the option to manually read the wiki. If I had to choose one version over the other for the MVP, I would choose RAG as I think this is probably more simple to implement and makes better use of the power of LLMs. At a minimum, the user should be able to manually read the documents produced by each root query and its children, though. This "human in the middle" aspect serves as another means by which further root queries can be generated to set off the workflow again, allowing a user to rapidly accumulate knowledge as their curiosity and own learning dictates, which is the USP of the product, potentially becoming a useful tool educational, clinical or research settings.

```mermaid
graph TB
    %% Nodes with icons and enhanced styling
    subgraph Client Layer
        Client["fa:fa-users Client Application"]:::clientStyle
    end

    subgraph API Layer
        API["fa:fa-server FastAPI Service"]:::apiStyle
        VAL["fa:fa-check-circle Request Validation"]:::validationStyle
        ES["fa:fa-file-code Event Schema"]:::schemaStyle
    end

    subgraph Event Processing
        EH["fa:fa-cogs Event Handler"]:::handlerStyle
        PR["fa:fa-stream Pipeline Registry"]:::pipelineStyle
        subgraph Pipeline
            PN1["fa:fa-dice-one Node 1"]:::pipelineNode
            PN2["fa:fa-dice-two Node 2"]:::pipelineNode
            PN3["fa:fa-random Router Node"]:::routerStyle
            PN4["fa:fa-brain LLM Node"]:::llmNode
            PN1 --> PN2
            PN2 --> PN3
            PN3 -->|Route A| PN4
        end
    end

    subgraph Queue System
        RD[("fa:fa-database Redis")]:::queueStyle
        CW["fa:fa-tasks Celery Workers"]:::workerStyle
    end

    subgraph Storage Layer
        PG[("fa:fa-database PostgreSQL")]:::storageStyle
        subgraph Vector Store
            VE["fa:fa-vector-square Vector Embeddings"]:::vectorStyle
            VI["fa:fa-th-list Vector Index"]:::vectorStyle
        end
        ET["fa:fa-table Events Table"]:::tableStyle
    end

    subgraph AI Services
        LF["fa:fa-industry LLM Factory"]:::llmFactoryStyle
        PM["fa:fa-scroll Prompt Manager"]:::managerStyle
        subgraph LLM Providers
            OAI["fa:fa-robot OpenAI"]:::providerStyle
            ANT["fa:fa-cloud Anthropic"]:::providerStyle
            LMA["fa:fa-desktop Local Models"]:::providerStyle
        end
    end

    %% Connections
    Client -->|HTTP| API
    API --> ES
    ES -->|Validate| VAL
    VAL -->|Create| EH
    EH -->|Store| ET
    EH -->|Queue| RD
    RD -->|Process| CW      
    CW -->|Load| PR
    PR -->|Execute| Pipeline
    PN4 -->|Request| LF
    LF -->|Load| PM
    LF -->|Route| OAI & ANT & LMA
    Pipeline -->|Update| ET

    %% Styles
    classDef clientStyle fill:#FFFFFF,stroke:#00A1E4,stroke-width:2px;
    classDef apiStyle fill:#F9F9F9,stroke:#7D3AC1,stroke-width:2px;
    classDef validationStyle fill:#C5E1A5,stroke:#558B2F,stroke-width:2px;
    classDef schemaStyle fill:#FFE082,stroke:#FFB300,stroke-width:2px;
    classDef handlerStyle fill:#F48FB1,stroke:#AD1457,stroke-width:2px;
    classDef pipelineStyle fill:#BBDEFB,stroke:#1E88E5,stroke-width:2px;
    classDef pipelineNode fill:#C5CAE9,stroke:#303F9F,stroke-width:2px;
    classDef routerStyle fill:#FFCDD2,stroke:#D32F2F,stroke-width:2px;
    classDef llmNode fill:#D7CCC8,stroke:#795548,stroke-width:2px;
    classDef queueStyle fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px;
    classDef workerStyle fill:#DCEDC8,stroke:#7CB342,stroke-width:2px;
    classDef storageStyle fill:#FFE0B2,stroke:#FF6F00,stroke-width:2px;
    classDef vectorStyle fill:#C5E1A5,stroke:#2E7D32,stroke-width:2px;
    classDef tableStyle fill:#D1C4E9,stroke:#7B1FA2,stroke-width:2px;
    classDef llmFactoryStyle fill:#B3E5FC,stroke:#0288D1,stroke-width:2px;
    classDef managerStyle fill:#FFECB3,stroke:#FF8F00,stroke-width:2px;
    classDef providerStyle fill:#CFD8DC,stroke:#455A64,stroke-width:2px;
```

```mermaid
graph TD
    User --> Client
    Client --> User
    Client[Client Layer] --> API[CRUD API]
    API --> RateLimiter[Rate Limiter]
    RateLimiter --> PipelineLayer[Pipeline Ochestration Layer API]
    PipelineLayer --> GPTResearcherPipeline[GPT Researcher Pipeline]
    PipelineLayer --> LibraryPipeline[LibraryPipeline]

    GPTResearcherPipeline --> Report[Report with Citations]
    Report --> LLMProcessors[LLM Processing Nodes]
    LLMProcessors --> SubquestionGenerator[Subquestion Generator]
    SubquestionGenerator --> API
    API --> ReportCollector
    Report --> API
    LibraryPipeline --> WikiGenerator[Wiki Generation Pipeline]
    WikiGenerator --> API
    LibraryPipeline --> VectorIndexer[Vector Indexer]
    VectorIndexer --> RAG[Retrieval-Augmented Generation]

    RAG --> API
    API --> Client
```
```
