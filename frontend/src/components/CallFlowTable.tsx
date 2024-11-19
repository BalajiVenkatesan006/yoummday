import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

interface CallFlow {
  id: number;
  name: string;
}

interface Props {
  callFlows: CallFlow[];
  onView: (flow: CallFlow) => void;
}

const CallFlowTable: React.FC<Props> = ({ callFlows, onView }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Flow Name</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {callFlows.map((flow) => (
          <TableRow key={flow.id}>
            <TableCell>{flow.name}</TableCell>
            <TableCell>
              <Button variant="outlined" color="primary" onClick={() => onView(flow)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default CallFlowTable;
