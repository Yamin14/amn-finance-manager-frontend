// types.ts
export interface Book {
    _id: string;
    title: string;
    cost: number;
    totalGiven?: number;
  }
  
  export interface Student {
    _id: string;
    name: string;
    className: string;
  }
  
  export interface Distribution {
    _id: string;
    student: Student;
    book: Book;
    amountPaid: number;
  }
  