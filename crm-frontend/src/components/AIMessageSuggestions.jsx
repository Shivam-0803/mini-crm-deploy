// AIMessageSuggestions.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { generateMessageSuggestions } from '@/lib/aiApi';
import { toast } from 'react-hot-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MessageVariant = ({ variant, onSelect }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(variant.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="relative group">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="capitalize">{variant.tone} Tone</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        <div className="text-sm font-medium">{variant.subject}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {variant.body}
        </p>
        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={() => onSelect(variant)}
        >
          Use this message
        </Button>
      </CardContent>
    </Card>
  );
};

const AIMessageSuggestions = ({ objective, audience, onSelectMessage }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const handleGenerateSuggestions = async () => {
    if (!objective?.trim() || !audience?.trim()) {
      toast.error('Campaign objective and audience are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const variants = await generateMessageSuggestions(objective, audience);

      if (!Array.isArray(variants) || variants.length === 0) {
        throw new Error('Invalid message suggestions format received');
      }

      setSuggestions(variants);
      toast.success('Message suggestions generated successfully!');
    } catch (error) {
      console.error('Error generating message suggestions:', error);

      if (error.response?.status === 429) {
        setError('Rate limit exceeded. Please wait and try again later.');
      } else if (error.response?.status === 401) {
        setError('Invalid API Key. Please contact the administrator.');
      } else {
        setError(
          error?.response?.data?.error ||
            error?.message ||
            'Unexpected error occurred'
        );
      }

      toast.error('Failed to generate message suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">AI Message Suggestions</h3>
          <p className="text-sm text-muted-foreground">
            Generate message variants based on your campaign objective
          </p>
        </div>
        <Button
          onClick={handleGenerateSuggestions}
          disabled={loading || !objective?.trim() || !audience?.trim()}
          className="flex items-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Ideas
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {suggestions.map((variant, index) => (
            <MessageVariant
              key={index}
              variant={variant}
              onSelect={(selectedVariant) => {
                onSelectMessage(selectedVariant);
                toast.success('Message variant selected!');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMessageSuggestions;
