-- CreateTable
CREATE TABLE "whatsapp_sessions" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "status" VARCHAR(32) NOT NULL DEFAULT 'stopped',
    "phone_e164" VARCHAR(32),
    "display_name" VARCHAR(255),
    "auth_dir" VARCHAR(512) NOT NULL,
    "last_qr_at" TIMESTAMPTZ(6),
    "last_error" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "whatsapp_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_stories" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "business_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biz_conversations" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "platform" VARCHAR(32) NOT NULL DEFAULT 'whatsapp',
    "remote_jid" VARCHAR(128) NOT NULL,
    "contact_name" VARCHAR(255),
    "preview" VARCHAR(512),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biz_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biz_messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "role" VARCHAR(16) NOT NULL,
    "text" TEXT NOT NULL,
    "wa_message_id" VARCHAR(128),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biz_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_sessions_organization_id_key" ON "whatsapp_sessions"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_stories_organization_id_key" ON "business_stories"("organization_id");

-- CreateIndex
CREATE INDEX "biz_conversations_organization_id_updated_at_idx" ON "biz_conversations"("organization_id", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "biz_conversations_organization_id_platform_remote_jid_key" ON "biz_conversations"("organization_id", "platform", "remote_jid");

-- CreateIndex
CREATE INDEX "biz_messages_conversation_id_created_at_idx" ON "biz_messages"("conversation_id", "created_at");

-- AddForeignKey
ALTER TABLE "whatsapp_sessions" ADD CONSTRAINT "whatsapp_sessions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_stories" ADD CONSTRAINT "business_stories_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biz_conversations" ADD CONSTRAINT "biz_conversations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biz_messages" ADD CONSTRAINT "biz_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "biz_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
