import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, AlertCircle } from 'lucide-react';
import { generateSegmentRules } from '@/lib/aiApi';
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AISegmentBuilder = ({ onRulesGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRules = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description of your target audience');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const rules = await generateSegmentRules(prompt);
      
      // Validate rules structure
      if (!rules.operator || !Array.isArray(rules.conditions) || rules.conditions.length === 0) {
        throw new Error('Invalid rules format received from server');
      }
      
      onRulesGenerated(rules);
      toast.success('Segment rules generated successfully!');
      setPrompt(''); // Clear the prompt after successful generation
    } catch (error) {
      console.error('Error generating rules:', error);
      // Show more detailed error message from the backend
      const errorMessage = error.response?.data?.details || error.response?.data?.error || error.message;
      
      // Handle specific error cases
      if (error.response?.status === 429) {
        setError('Rate limit exceeded. Please try again in a few minutes.');
      } else if (error.response?.status === 401) {
        setError('API key error. Please contact support.');
      } else {
        setError(errorMessage);
      }
      
      toast.error('Failed to generate segment rules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Describe your target audience in plain English
        </label>
        <Textarea
          placeholder="e.g., People who haven't shopped in 6 months and spent over ₹5000"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setError(null); // Clear error when user starts typing
          }}
          className="h-24"
          disabled={loading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleGenerateRules}
        disabled={loading || !prompt.trim()}
        className="w-full"
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">⚡</span>
            Generating rules...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Segment Rules
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        💡 Tip: Be specific about customer behaviors, spending patterns, and timeframes
      </p>
    </div>
  );
};

export default AISegmentBuilder; 