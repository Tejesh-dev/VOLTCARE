export interface Product {
  id: number;
  name: string;
  size: string;
  category: string;
}

export const plumbingProducts: Product[] = [
  { id: 1, name: "CPVC Pipe", size: "1 Inch", category: "Plumbing" },
  { id: 2, name: "Coupler", size: "1 Inch", category: "Plumbing" },
  { id: 3, name: "90° Elbow", size: "1 Inch", category: "Plumbing" },
  { id: 4, name: "45° Elbow", size: "1 Inch", category: "Plumbing" },
  { id: 5, name: "Equal Tee", size: "1 Inch", category: "Plumbing" },
  { id: 6, name: "Ball Valve", size: "1 Inch", category: "Plumbing" },
  { id: 7, name: "Tank Connector", size: "1 Inch", category: "Plumbing" },
  { id: 8, name: "End Cap", size: "1 Inch", category: "Plumbing" },
  { id: 9, name: "Union", size: "1 Inch", category: "Plumbing" },
  { id: 10, name: "Male Threaded Adaptor (MTA)", size: "1 Inch", category: "Plumbing" },
  { id: 11, name: "Female Threaded Adaptor (FTA)", size: "1 Inch", category: "Plumbing" },
  { id: 12, name: "Step-over Bend", size: "1 Inch", category: "Plumbing" }
];
