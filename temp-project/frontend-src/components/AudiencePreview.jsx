import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UsersRound, Loader2 } from 'lucide-react';
import { previewAudienceSize } from '@/lib/crmApi';

const AudiencePreview = ({ open, onOpenChange, segmentRules }) => {
  const [loading, setLoading] = useState(true);
  const [audienceData, setAudienceData] = useState(null);
  const [error, setError] = useState(null);

  // Call API to calculate audience size
  useEffect(() => {
    if (open && segmentRules && segmentRules.conditions && segmentRules.conditions.length > 0) {
      setLoading(true);
      setError(null);
      
      // Call the backend API for audience preview
      previewAudienceSize(segmentRules)
        .then(data => {
          setAudienceData({
            size: data.audienceSize,
            total: data.totalAudience,
            percentage: data.percentage,
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching audience preview:', err);
          setError('Failed to calculate audience size');
          setLoading(false);
        });
    }
  }, [open, segmentRules]);

  // Helper function to format a single condition
  const formatCondition = (condition) => {
    if (condition.operator && condition.conditions) {
      // This is a nested group
      return formatRulesGroup(condition);
    }
    
    // This is a simple condition
    const typeLabels = {
      spend: 'Total Spend',
      visits: 'Number of Visits',
      inactive: 'Inactive for Days',
      purchases: 'Number of Purchases',
      location: 'Location'
    };
    
    const type = typeLabels[condition.type] || condition.type;
    return `${type} ${condition.operator} ${condition.value}`;
  };
  
  // Helper function to format a group of rules
  const formatRulesGroup = (rules, nested = false) => {
    if (!rules || !rules.conditions || rules.conditions.length === 0) {
      return 'No conditions defined';
    }
    
    // Format each condition or nested group
    const formattedConditions = rules.conditions.map(formatCondition);
    
    // Join with the appropriate operator
    const joined = formattedConditions.join(` ${rules.operator} `);
    
    // If this is a nested group, wrap in parentheses
    return nested ? `(${joined})` : joined;
  };

  const formatRules = (rules) => {
    return formatRulesGroup(rules);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Audience Preview</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 text-sm bg-muted p-3 rounded-md">
            <strong>Segment Rules:</strong>
            <div className="mt-1">
              {formatRules(segmentRules)}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Calculating audience size...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-500 rounded-md text-center">
              {error}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 bg-muted rounded-lg">
              <UsersRound className="h-10 w-10 text-primary mb-2" />
              <h3 className="text-3xl font-bold">{audienceData.size.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">
                {audienceData.percentage}% of your total audience ({audienceData.total.toLocaleString()})
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AudiencePreview; 