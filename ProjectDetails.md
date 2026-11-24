**MH Tax & Invoice Autopilot** is a strong, enterprise-grade portfolio project. It directly demonstrates how to build deterministic, auditable AI workflows for financial compliance (such as UAE VAT and Corporate Tax)—moving far beyond basic chat wrappers into real business automation.

---

### 1. System Architecture & Core Features

The application acts as an intelligent pre-accounting layer between raw business documents and the general ledger:

* **Automated Invoice & Receipt Ingestion:** Drag-and-drop upload for PDFs, scanned receipts, and images.
* **Structured Data Extraction (`HasStructuredOutput`):** Parses vendor details, TRN (Tax Registration Numbers), line items, subtotals, and VAT amounts into strict, validated schemas.
* **RAG Tax & Compliance Copilot (`pgvector`):** Allows accountants to query uploaded tax laws, FTA (Federal Tax Authority) guidelines, and internal expense policies with cited answers.
* **Human-in-the-Loop Ledger Posting (`Approvable` Tool):** When the AI categorizes an expense and prepares a journal entry or VAT return adjustment, execution pauses until a human accountant reviews and approves the payload in the dashboard.
* **Multi-Provider Resilience:** Configures primary and fallback LLM providers (e.g., Gemini/OpenAI for Vision + DeepSeek for text reasoning) to balance cost and uptime.

---

### 2. Recommended Tech Stack

| Layer                       | Technology                          | Role in Project                                                                               |
| --------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| **Backend Framework**       | **Laravel 12+ (PHP 8.3+)**          | Core business logic, queues, authentication, and Eloquent ORM.                                |
| **AI Orchestration**        | **Laravel AI SDK (`laravel/ai`)**   | Agents, `HasStructuredOutput`, `Approvable` tools, embeddings, and streaming.                 |
| **Database & Vector Store** | **PostgreSQL + `pgvector**`         | Relational accounting tables + vector similarity search in one database.                      |
| **Frontend Stack**          | **React + Inertia.js + TypeScript** | SPA-like dashboard with end-to-end type safety.                                               |
| **UI Components**           | **Mantine UI / Tailwind CSS**       | Clean financial tables, split-screen PDF/data review modals, and status badges.               |
| **Background Workers**      | **Redis + Laravel Horizon**         | Asynchronous document parsing, batch embedding generation, and queue monitoring.              |
| **Testing**                 | **Pest PHP**                        | Using `Agent::fake()` and `Embeddings::fake()` to test workflows without burning API credits. |

---

### 3. Database Schema Overview

To make the system look genuinely production-ready, structure your core tables around auditability:

* **`organizations`:** Stores company name, Tax Registration Number (TRN), default currency (`$`, `USD`, `BDT`), and VAT rate (`5.00%`).
* **`invoices`:** Stores file path, processing status (`queued`, `parsed`, `pending_approval`, `posted`), extracted JSON payload, confidence score, and calculated VAT.
* **`invoice_items`:** Line-by-line extracted items with quantity, unit price, tax code (`standard`, `zero-rated`, `exempt`), and total.
* **`ai_tool_approvals`:** Tracks paused `Approvable` tool invocations (`invocation_id`, `agent_name`, `proposed_payload`, `approved_by`, `approved_at`).
* **`tax_knowledge_chunks`:** Stores chunked tax regulations and a `vector(1536)` column for RAG queries.

---

### 4. Step-by-Step Development Roadmap (4 Weeks)

#### Phase 1: Foundation & Multi-Tenant Ledger Setup (Week 1)

1. Initialize Laravel with Inertia.js (React + TypeScript) and configure **PostgreSQL** with the `pgvector` extension enabled.
2. Build core models and migrations for `Organizations`, `ChartOfAccounts`, `Invoices`, and `InvoiceItems`.
3. Install `laravel/ai` and configure `config/ai.php` with provider keys and automatic fallback arrays.
4. Set up **Redis + Laravel Horizon** so document processing runs asynchronously.

#### Phase 2: Multimodal Invoice Parsing Pipeline (Week 2)

1. Build the file upload UI supporting PDFs and receipt images.
2. Create an `InvoiceExtractorAgent` implementing `HasStructuredOutput` to return strictly validated fields (`vendor_name`, `trn`, `invoice_date`, `subtotal`, `vat_amount`, `line_items`).
3. Dispatch a queued job (`ProcessUploadedInvoice`) upon upload that invokes the agent, saves the structured output, and flags anomalies (e.g., if `subtotal + vat != total` or TRN is missing).
4. Build a **Split-Screen Review UI** in React: original PDF/image on the left, extracted form fields on the right.

#### Phase 3: Human-in-the-Loop Ledger Posting (Week 3)

1. Create a `PostJournalEntryTool` implementing the `Approvable` contract.
2. Build a `TaxComplianceAgent` equipped with this tool. When an invoice is reviewed, the agent determines the correct Chart of Accounts category (e.g., *Office Supplies*, *Software Subscriptions*) and attempts to post the ledger entry.
3. Capture the `requiresApproval()` pause state, store it in `ai_tool_approvals`, and surface an **"Approval Queue"** badge in the navbar.
4. Allow the accountant to click **Approve & Post** (which calls `$agent->approve($invocationId)`) or **Reject with Note**.

#### Phase 4: Tax Policy RAG Copilot & Testing (Week 4)

1. Build an admin seeder/uploader to ingest UAE VAT or Corporate Tax guide PDFs into `tax_knowledge_chunks` using `Embeddings::for($chunks)->generate()`.
2. Create a `SearchTaxGuidelinesTool` and attach it to a streaming `TaxAdvisorAgent` (`RemembersConversations`).
3. Embed a floating **Tax Copilot Drawer** in React using streaming hooks so accountants can ask questions like *"Can I reclaim input VAT on employee entertainment expenses?"*
4. Write Pest feature tests using `Agent::fake()` to verify extraction schemas and approval pauses, and record a 2-minute walkthrough video for your GitHub `README.md`.

---

### Portfolio Differentiators to Highlight

When showcasing this project to employers or clients, emphasize three architectural decisions:

* **Zero Hallucinated Math:** The LLM extracts raw figures, while deterministic PHP service classes validate tax arithmetic before posting.
* **Strict Audit Trail:** Every database mutation triggered by AI passes through an `Approvable` gate with user attribution.
* **Cost-Aware Routing:** Fast, inexpensive models handle initial classification and text queries, reserving multimodal vision models strictly for scanned receipts.
