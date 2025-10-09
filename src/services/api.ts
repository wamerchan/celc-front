import { User } from '../context/AuthContext';

// Mock API service

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  console.log('Logging in with:', { email, password });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password') {
        const fakeToken = 'fake-jwt-token';
        const fakeUser: User = { id: '1', name: 'Admin User', email: email, role: 'admin' };
        resolve({ token: fakeToken, user: fakeUser });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const getTotalActiveLines = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(150);
    }, 500);
  });
};

export const getEquipmentsInRepair = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(12);
    }, 800);
  });
};

export const getUpcomingReviews = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(5);
    }, 1200);
  });
};

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'User' },
];

export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 500);
  });
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = { ...user, id: String(mockUsers.length + 1) };
      mockUsers.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

export const updateUser = async (user: User): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        mockUsers[index] = user;
      }
      resolve(user);
    }, 500);
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex((u) => u.id === userId);
      if (index !== -1) {
        mockUsers.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};

export interface Line {
  id: string;
  number: string;
  status: string;
  plan: string;
}

const mockLines: Line[] = [
  { id: '1', number: '123456789', status: 'Active', plan: 'Basic' },
  { id: '2', number: '987654321', status: 'Inactive', plan: 'Premium' },
];

export const getLines = async (): Promise<Line[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLines);
    }, 500);
  });
};

export const createLine = async (line: Omit<Line, 'id'>): Promise<Line> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLine = { ...line, id: String(mockLines.length + 1) };
      mockLines.push(newLine);
      resolve(newLine);
    }, 500);
  });
};

export const updateLine = async (line: Line): Promise<Line> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockLines.findIndex((l) => l.id === line.id);
      if (index !== -1) {
        mockLines[index] = line;
      }
      resolve(line);
    }, 500);
  });
};

export const deleteLine = async (lineId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockLines.findIndex((l) => l.id === lineId);
      if (index !== -1) {
        mockLines.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};

export interface Equipment {
  id: string;
  model: string;
  brand: string;
  status: string;
}

const mockEquipments: Equipment[] = [
  { id: '1', model: 'iPhone 13', brand: 'Apple', status: 'In Use' },
  { id: '2', model: 'Galaxy S22', brand: 'Samsung', status: 'In Stock' },
];

export const getEquipments = async (): Promise<Equipment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEquipments);
    }, 500);
  });
};

export const createEquipment = async (equipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEquipment = { ...equipment, id: String(mockEquipments.length + 1) };
      mockEquipments.push(newEquipment);
      resolve(newEquipment);
    }, 500);
  });
};

export const updateEquipment = async (equipment: Equipment): Promise<Equipment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEquipments.findIndex((e) => e.id === equipment.id);
      if (index !== -1) {
        mockEquipments[index] = equipment;
      }
      resolve(equipment);
    }, 500);
  });
};

export const deleteEquipment = async (equipmentId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEquipments.findIndex((e) => e.id === equipmentId);
      if (index !== -1) {
        mockEquipments.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};

export interface Assignment {
  id: string;
  user: string;
  line: string;
  equipment: string;
}

const mockAssignments: Assignment[] = [
  { id: '1', user: 'John Doe', line: '123456789', equipment: 'iPhone 13' },
  { id: '2', user: 'Jane Doe', line: '987654321', equipment: 'Galaxy S22' },
];

export const getAssignments = async (): Promise<Assignment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAssignments);
    }, 500);
  });
};

export const createAssignment = async (assignment: Omit<Assignment, 'id'>): Promise<Assignment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAssignment = { ...assignment, id: String(mockAssignments.length + 1) };
      mockAssignments.push(newAssignment);
      resolve(newAssignment);
    }, 500);
  });
};

export const updateAssignment = async (assignment: Assignment): Promise<Assignment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockAssignments.findIndex((a) => a.id === assignment.id);
      if (index !== -1) {
        mockAssignments[index] = assignment;
      }
      resolve(assignment);
    }, 500);
  });
};

export const deleteAssignment = async (assignmentId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockAssignments.findIndex((a) => a.id === assignmentId);
      if (index !== -1) {
        mockAssignments.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};

export interface Review {
  id: string;
  equipment: string;
  date: string;
  result: string;
}

const mockReviews: Review[] = [
  { id: '1', equipment: 'iPhone 13', date: '2023-10-26', result: 'Passed' },
  { id: '2', equipment: 'Galaxy S22', date: '2023-10-27', result: 'Failed' },
];

export const getReviews = async (): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReviews);
    }, 500);
  });
};

export const createReview = async (review: Omit<Review, 'id'>): Promise<Review> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview = { ...review, id: String(mockReviews.length + 1) };
      mockReviews.push(newReview);
      resolve(newReview);
    }, 500);
  });
};

export const updateReview = async (review: Review): Promise<Review> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockReviews.findIndex((r) => r.id === review.id);
      if (index !== -1) {
        mockReviews[index] = review;
      }
      resolve(review);
    }, 500);
  });
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockReviews.findIndex((r) => r.id === reviewId);
      if (index !== -1) {
        mockReviews.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};
