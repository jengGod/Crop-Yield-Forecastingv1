import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk'
})
export class ChunkPipe implements PipeTransform {
  transform<T>(array: T[], chunkSize: number): T[][] {
    if (!array || chunkSize < 1) return [];

    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    
    return result;
  }
}