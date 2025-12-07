import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Star, Smile, ThumbsUp, MessageSquare } from 'lucide-react';

interface SatisfactionSurveyProps {
  open: boolean;
  onClose: () => void;
  driverName: string;
  tripId: string;
}

export function SatisfactionSurvey({ open, onClose, driverName, tripId }: SatisfactionSurveyProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comfort, setComfort] = useState<number | null>(null);
  const [punctuality, setPunctuality] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Aquí se enviaría la encuesta al backend
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset form
      setRating(0);
      setComfort(null);
      setPunctuality(null);
      setComments('');
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md" aria-describedby="survey-success">
          <div className="text-center py-6" id="survey-success">
            <div className="bg-green-100 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="size-8 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">¡Gracias por tu opinión!</h3>
            <p className="text-sm text-gray-500">Tu feedback nos ayuda a mejorar el servicio</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¿Cómo fue tu viaje?</DialogTitle>
          <DialogDescription>
            Viaje {tripId} con {driverName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Rating */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">Calificación general</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`size-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comfort Rating */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smile className="size-4 text-blue-600" />
                <p className="text-sm text-gray-700">Comodidad del viaje</p>
              </div>
              <span className="text-sm text-gray-500">{comfort ? `${comfort}/5` : '-'}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setComfort(level)}
                  className={`flex-1 h-10 rounded-lg border-2 transition-colors ${
                    comfort === level
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Punctuality Rating */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-green-600" />
                <p className="text-sm text-gray-700">Puntualidad</p>
              </div>
              <span className="text-sm text-gray-500">{punctuality ? `${punctuality}/5` : '-'}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPunctuality(level)}
                  className={`flex-1 h-10 rounded-lg border-2 transition-colors ${
                    punctuality === level
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <p className="text-sm text-gray-700 mb-2">Comentarios adicionales (opcional)</p>
            <Textarea
              placeholder="Cuéntanos más sobre tu experiencia..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Enviar calificación
          </Button>

          {rating === 0 && (
            <p className="text-xs text-center text-gray-500">
              Por favor califica tu viaje antes de enviar
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}