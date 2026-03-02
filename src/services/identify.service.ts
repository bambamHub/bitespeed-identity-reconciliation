import prisma from "../config/prisma";

interface IdentifyInput {
  email?: string;
  phoneNumber?: string;
}

export const identifyContact = async ({ email, phoneNumber }: IdentifyInput) => {
  // 1️⃣ Find all matching contacts
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phoneNumber ? { phoneNumber } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (existingContacts.length === 0) {
    // 2️⃣ Create new primary contact
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });

    return buildResponse(newContact.id);
  }

  // 3️⃣ Find all linked contacts recursively
  const allRelatedContacts = await getAllLinkedContacts(existingContacts);

  // 4️⃣ Find oldest as primary
  const primary = allRelatedContacts.sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  )[0];

  // 5️⃣ Convert other primaries into secondary if needed
  for (const contact of allRelatedContacts) {
    if (
      contact.id !== primary.id &&
      contact.linkPrecedence === "primary"
    ) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          linkPrecedence: "secondary",
          linkedId: primary.id,
        },
      });
    }
  }

  // 6️⃣ If new info provided, create secondary
  const emails = allRelatedContacts.map(c => c.email);
  const phones = allRelatedContacts.map(c => c.phoneNumber);

  if (
    (email && !emails.includes(email)) ||
    (phoneNumber && !phones.includes(phoneNumber))
  ) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "secondary",
        linkedId: primary.id,
      },
    });
  }

  return buildResponse(primary.id);
};

const getAllLinkedContacts = async (contacts: any[]) => {
  const ids = contacts.map(c => c.id);
  const primaryIds = contacts.map(c =>
    c.linkedId ? c.linkedId : c.id
  );

  return prisma.contact.findMany({
    where: {
      OR: [
        { id: { in: ids } },
        { linkedId: { in: primaryIds } },
        { id: { in: primaryIds } },
      ],
    },
  });
};

const buildResponse = async (primaryId: number) => {
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [{ id: primaryId }, { linkedId: primaryId }],
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  const primary = contacts.find(c => c.id === primaryId)!;
  const secondaryContacts = contacts.filter(c => c.id !== primaryId);

  // Unique emails (primary first)
  const emails = Array.from(
    new Set(
      [
        primary.email,
        ...secondaryContacts.map(c => c.email)
      ].filter(Boolean)
    )
  );

  // Unique phone numbers (primary first)
  const phoneNumbers = Array.from(
    new Set(
      [
        primary.phoneNumber,
        ...secondaryContacts.map(c => c.phoneNumber)
      ].filter(Boolean)
    )
  );

  return {
    contact: {
      primaryContactId: primary.id,
      emails,
      phoneNumbers,
      secondaryContactIds: secondaryContacts.map(c => c.id),
    },
  };
};