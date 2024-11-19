import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
} from '@mui/material';
import { useAxios } from '../hooks/useAxios';
import ReactFlow, {
  ReactFlowProvider,
  Node,
  Edge,
  Position,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import dagre from 'dagre';

import CallFlowTable from './CallFlowTable';

interface Step {
  id: string;
  name: string;
  description: string;
  phrases: string[];
  parent: string | null;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - 100,
      y: nodeWithPosition.y - 50,
    };
  });

  return { nodes, edges };
};

const Home: React.FC = () => {
  const [callFlows, setCallFlows] = useState([]);
  const [currentFlow, setCurrentFlow] = useState<Step[]>([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [flowName, setFlowName] = useState('');
  const [stepName, setStepName] = useState('');
  const [description, setDescription] = useState('');
  const [phrases, setPhrases] = useState('');
  const [parentStep, setParentStep] = useState('');
  const [viewConfig, setViewConfig] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const axiosInstance = useAxios();

  useEffect(() => {
    fetchCallFlows();
  }, []);

  const fetchCallFlows = async () => {
    try {
      const response = await axiosInstance.get('/api/callflow/configs/');
      setCallFlows(response.data);
    } catch (error) {
      console.error('Error fetching call flows:', error);
    }
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: `step-${currentFlow.length + 1}`,
      name: stepName,
      description,
      phrases: phrases.split(',').map((phrase) => phrase.trim()),
      parent: parentStep || null,
    };
    setCurrentFlow([...currentFlow, newStep]);
    setStepName('');
    setDescription('');
    setPhrases('');
    setParentStep('');
  };

  const handleCloseFlow = ()=> {
    setStepName('');
    setDescription('');
    setPhrases('');
    setParentStep('');
    setFlowName('');
    setCurrentFlow([]);
    setConfigOpen(false);
  }
  const handleSaveFlow = async () => {
    const hierarchicalFlow = { name: flowName, flow_data: currentFlow };

    try {
      await axiosInstance.post('/api/callflow/configs/', hierarchicalFlow);
      fetchCallFlows();
      setConfigOpen(false);
      setFlowName('');
      setCurrentFlow([]);
    } catch (error) {
      console.error('Error saving call flow:', error);
    }
  };

  const handleViewConfig = (flow: any) => {
    setViewConfig(flow);
    const { nodes, edges } = prepareGraph(flow.flow_data);
    const layoutedElements = getLayoutedElements(nodes, edges);
    setNodes(layoutedElements.nodes);
    setEdges(layoutedElements.edges);
  };

  const prepareGraph = (steps: Step[]) => {
    const nodes: Node[] = steps.map((step) => ({
      id: step.id,
      data: {
        label: (
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {step.name}
            </Typography>
            <Typography variant="body2">{step.description}</Typography>
            <Typography variant="caption">
              Phrases: {step.phrases.join(', ')}
            </Typography>
          </Box>
        ),
      },
      position: { x: 0, y: 0 }, // Initial position, will be updated by dagre
      style: { width: 200, height: 100 },
    }));

    const edges: Edge[] = steps
      .filter((step) => step.parent)
      .map((step) => ({
        id: `e-${step.parent}-${step.id}`,
        source: step.parent!,
        target: step.id,
        animated: true,
      }));

    return { nodes, edges };
  };

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4">Call Flow Configurations</Typography>
        <Button variant="contained" color="primary" onClick={() => setConfigOpen(true)}>
          Create New Call Flow
        </Button>

        <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Call Flow</DialogTitle>
          <DialogContent>
            <TextField
              label="Flow Name"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Typography variant="h6" gutterBottom>
              Add Steps
            </Typography>
            <TextField
              label="Step Name"
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mandatory Phrases (comma-separated)"
              value={phrases}
              onChange={(e) => setPhrases(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Typography variant="subtitle1" gutterBottom>
              Select Parent Step (Optional)
            </Typography>
            <Select
              value={parentStep}
              onChange={(e) => setParentStep(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">No Parent (Root Step)</MenuItem>
              {currentFlow.map((step) => (
                <MenuItem key={step.id} value={step.id}>
                  {step.name}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={handleAddStep} variant="contained" color="secondary" sx={{ mt: 2 }}>
              Add Step
            </Button>

            <Typography variant="h6" sx={{ mt: 4 }}>
              Steps Added
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Step Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Mandatory Phrases</TableCell>
                    <TableCell>Parent Step</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentFlow.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell>{step.name}</TableCell>
                      <TableCell>{step.description}</TableCell>
                      <TableCell>{step.phrases.join(', ')}</TableCell>
                      <TableCell>{step.parent || 'None'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFlow} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveFlow} color="primary">
              Save Flow
            </Button>
          </DialogActions>
        </Dialog>

        <Box my={4}>
          <CallFlowTable callFlows={callFlows} onView={handleViewConfig} />
        </Box>
      </Box>

      {viewConfig && (
        <Dialog open={!!viewConfig} onClose={() => setViewConfig(null)} maxWidth="lg" fullWidth>
          <DialogTitle>View Configuration</DialogTitle>
          <DialogContent>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                style={{ width: '100%', height: '500px' }}
              />
            </ReactFlowProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewConfig(null)} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Home;
