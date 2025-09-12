using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GuitarLessons.Domain.Entities
{
    public class Video
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        
        public string StoragePath { get; set; } = string.Empty;

       
        public string? PreviewUrl { get; set; }
    }
}
