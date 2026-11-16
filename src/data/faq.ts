export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: "enrolment",
    question: "How are students enrolled?",
    answer:
      "Prospective students reach out via WhatsApp to express interest, followed by a brief interview before a place is confirmed.",
  },
  {
    id: "assessments",
    question: "How often are assessments held?",
    answer:
      "Assessments are held monthly to track each student's progress across their enrolled subjects.",
  },
  {
    id: "format",
    question: "Is the programme conducted in person or online?",
    answer:
      "The programme is conducted online — primarily via WhatsApp, with occasional live sessions on Google Meet.",
  },
  {
    id: "contact",
    question: "Who do I contact for more information?",
    answer: "You can reach us via WhatsApp or email — see the Contact section below for details.",
  },
];
